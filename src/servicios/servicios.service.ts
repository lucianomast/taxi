import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CrearServicioDto } from './dto/crear-servicio.dto';
import { ActualizarServicioDto } from './dto/actualizar-servicio.dto';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Conductor } from '../conductores/entities/conductor.entity';
import { ConductorPosicion } from '../conductores/entities/conductor-posicion.entity';
import { TarifasService } from '../tarifas/tarifas.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import * as NodeGeocoder from 'node-geocoder';

@Injectable()
export class ServiciosService {
  private readonly logger = new Logger(ServiciosService.name);

  constructor(
    @InjectRepository(Servicio)
    private readonly serviciosRepository: Repository<Servicio>,
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
    @InjectRepository(Conductor)
    private readonly conductoresRepository: Repository<Conductor>,
    @InjectRepository(ConductorPosicion)
    private readonly conductorPosicionRepository: Repository<ConductorPosicion>,
    private readonly tarifasService: TarifasService, // Agregar servicio de tarifas
    private readonly notificacionesService: NotificacionesService, // Agregar servicio de notificaciones
  ) {}

  async crear(dto: CrearServicioDto) {
    const cliente = await this.clientesRepository.findOne({ where: { id: dto.clienteId } });
    if (!cliente) {
      throw new NotFoundException('No se ha encontrado un cliente con ese id');
    }
    if (dto.conductorId) {
      const conductor = await this.conductoresRepository.findOne({ where: { id: dto.conductorId } });
      if (!conductor) {
        throw new NotFoundException('No se ha encontrado un conductor con ese id');
      }
    }

    // Usar las coordenadas proporcionadas por el frontend
    const coordenadasServicio = {
      origenLat: dto.origenLat,
      origenLon: dto.origenLon,
      destinoLat: dto.destinoLat,
      destinoLon: dto.destinoLon
    };
    console.log('Coordenadas proporcionadas por el frontend:', coordenadasServicio);

    // Calcular precio automáticamente usando la API de tarifas con las coordenadas proporcionadas
    let precioCalculado: number;
    try {
      const resultadoPrecio = await this.tarifasService.calcularPrecio({
        origen: dto.origen,
        destino: dto.destino,
        origenLat: dto.origenLat,
        origenLon: dto.origenLon,
        destinoLat: dto.destinoLat,
        destinoLon: dto.destinoLon,
        fecha: new Date().toISOString().split('T')[0], // Fecha actual
        hora: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        tipo_servicio: 'normal',
        zona: 'general'
      });

      precioCalculado = resultadoPrecio.precio;
    } catch (error) {
      console.error('Error calculando precio:', error);
      // Si falla el cálculo, usar precio por defecto o el precio enviado
      precioCalculado = dto.precio || 0;
    }

    // Si es servicio inmediato y no se proporciona conductorId, buscar conductor automáticamente
    if (dto.inmediato && !dto.conductorId) {
      try {
        console.log('🔍 Buscando conductor para servicio inmediato...');
        const resultadoTiempo = await this.getTiempoEstimado(true, dto.origen);
        dto.conductorId = resultadoTiempo.conductor.id;
        console.log(`✅ Conductor asignado automáticamente: ${resultadoTiempo.conductor.nombre} ${resultadoTiempo.conductor.apellidos} (ID: ${resultadoTiempo.conductor.id})`);
        console.log(`⏱️ Tiempo estimado de llegada: ${resultadoTiempo.duracionText}`);
      } catch (error) {
        console.error('❌ Error asignando conductor automáticamente:', error.message);
        throw new NotFoundException('No se pudo asignar un conductor automáticamente. No hay conductores disponibles para servicio inmediato.');
      }
    }



    try {
      const servicio = this.serviciosRepository.create({
        ...dto,
        origenLat: coordenadasServicio.origenLat,
        origenLon: coordenadasServicio.origenLon,
        destinoLat: coordenadasServicio.destinoLat,
        destinoLon: coordenadasServicio.destinoLon,
        precio: precioCalculado, // Usar el precio calculado
        created_at: new Date(),
      });
      
      const servicioGuardado = await this.serviciosRepository.save(servicio);
      
      // Enviar notificación push al conductor si está asignado
      if (servicioGuardado.conductorId) {
        try {
          this.logger.log(`📱 Enviando notificación push al conductor ${servicioGuardado.conductorId} sobre servicio ${servicioGuardado.id}`);
          
          await this.notificacionesService.enviarNotificacionServicioAsignado(
            servicioGuardado.conductorId,
            servicioGuardado.id,
            {
              origen: servicioGuardado.origen,
              destino: servicioGuardado.destino,
              precio: servicioGuardado.precio,
              fecha: servicioGuardado.created_at
            }
          );
          
          this.logger.log(`✅ Notificación push enviada exitosamente al conductor ${servicioGuardado.conductorId}`);
        } catch (error) {
          this.logger.error(`❌ Error enviando notificación push al conductor ${servicioGuardado.conductorId}:`, error);
          // No lanzar error para no interrumpir la creación del servicio
        }
      }
      
      return servicioGuardado;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla servicios no existe en la base de datos.');
      }
      throw error;
    }
  }

  async actualizar(id: number, dto: ActualizarServicioDto): Promise<Servicio> {
    const servicio = await this.serviciosRepository.findOne({ where: { id } });
    if (!servicio) throw new NotFoundException('Servicio no encontrado');
    Object.assign(servicio, dto, { updated_at: new Date() });
    return this.serviciosRepository.save(servicio);
  }

  async getLista(): Promise<Servicio[]> {
    return this.serviciosRepository.find();
  }

  async getById(id: number): Promise<Servicio> {
    const servicio = await this.serviciosRepository.findOne({ where: { id } });
    if (!servicio) throw new NotFoundException('Servicio no encontrado');
    return servicio;
  }

  async getListaConductor(conductorId: number) {
    return this.serviciosRepository.find({ where: { conductorId } });
  }

  private async obtenerCoordenadas(direccion: string): Promise<{ lat: string; lng: string }> {
    try {
      const options: any = {
        provider: 'openstreetmap',
        formatter: null
      };

      const geocoder = NodeGeocoder(options);
      const results = await geocoder.geocode(direccion);
      
      if (!results || results.length === 0) {
        throw new Error(`No se encontraron coordenadas para: ${direccion}`);
      }

      const result = results[0];
      
      if (!result.latitude || !result.longitude) {
        throw new Error(`Coordenadas incompletas para: ${direccion}`);
      }
      
      return {
        lat: result.latitude!.toString(),
        lng: result.longitude!.toString()
      };
    } catch (error) {
      console.error(`Error obteniendo coordenadas para ${direccion}:`, error);
      throw new Error(`Error al obtener coordenadas para: ${direccion}`);
    }
  }

  private async obtenerCoordenadasServicio(origen: string, destino: string): Promise<{
    origenLat: string;
    origenLon: string;
    destinoLat: string;
    destinoLon: string;
  }> {
    try {
      // Obtener coordenadas del origen
      const coordenadasOrigen = await this.obtenerCoordenadas(origen);
      
      // Obtener coordenadas del destino
      const coordenadasDestino = await this.obtenerCoordenadas(destino);

      return {
        origenLat: coordenadasOrigen.lat,
        origenLon: coordenadasOrigen.lng,
        destinoLat: coordenadasDestino.lat,
        destinoLon: coordenadasDestino.lng
      };
    } catch (error) {
      console.error('Error obteniendo coordenadas del servicio:', error);
      throw new Error('Error al obtener coordenadas del servicio');
    }
  }

  /**
   * Obtiene el tiempo estimado de llegada del conductor más cercano
   */
  async getTiempoEstimado(inmediato: boolean = false, origen?: string): Promise<any> {
    try {
      // Obtener la fecha actual para verificar penalizaciones
      const ahora = new Date();

      // Construir la consulta base para conductores disponibles
      const queryBuilder = this.conductoresRepository
        .createQueryBuilder('conductor')
        .leftJoinAndSelect('conductor.posicion', 'posicion')
        .where('conductor.estadoUsuario = :estadoUsuario', { estadoUsuario: 10 }) // Activo
        .andWhere('conductor.estado = :estado', { estado: 10 }) // Disponible
        .andWhere('conductor.activoParaInmediatos = :activoParaInmediatos', { activoParaInmediatos: 1 }) // Activo para inmediatos
        .andWhere('conductor.matricula != :matricula', { matricula: '' }) // Con matrícula
        .andWhere('conductor.logado = :logado', { logado: 1 }) // Logado
        .andWhere('conductor.activo = :activo', { activo: true }) // Activo
        .andWhere('(conductor.ultimaPenalizacion IS NULL OR conductor.ultimaPenalizacion < :ahora)', { ahora }) // No penalizado
        .andWhere('posicion.id IS NOT NULL'); // Con posición registrada

      const conductoresDisponibles = await queryBuilder.getMany();

      if (conductoresDisponibles.length === 0) {
        throw new NotFoundException('No hay conductores disponibles en este momento');
      }

      // Seleccionar el conductor más cercano si se proporciona origen
      let conductorSeleccionado = conductoresDisponibles[0];
      
      if (origen) {
        // Calcular distancia desde cada conductor hasta el origen
        let menorDistancia = Infinity;
        let conductorMasCercano = conductorSeleccionado;

        for (const conductor of conductoresDisponibles) {
          if (conductor.posicion && conductor.posicion.lat && conductor.posicion.lon) {
            try {
              // Calcular distancia usando las coordenadas reales del conductor
              const distancia = await this.calcularDistanciaDesdeConductor(
                parseFloat(conductor.posicion.lat),
                parseFloat(conductor.posicion.lon),
                origen
              );

              if (distancia < menorDistancia) {
                menorDistancia = distancia;
                conductorMasCercano = conductor;
              }
            } catch (error) {
              console.error(`Error calculando distancia para conductor ${conductor.id}:`, error);
            }
          }
        }

        conductorSeleccionado = conductorMasCercano;
      }

      // Calcular tiempo estimado basado en distancia real desde la posición del conductor
      let tiempoEstimado: number;
      if (origen && conductorSeleccionado.posicion) {
        try {
          const distancia = await this.calcularDistanciaDesdeConductor(
            parseFloat(conductorSeleccionado.posicion.lat),
            parseFloat(conductorSeleccionado.posicion.lon),
            origen
          );
          
          // Velocidad promedio en ciudad: 30 km/h = 0.5 km/min
          const velocidadKmMin = 0.5;
          tiempoEstimado = Math.max(Math.round(distancia / velocidadKmMin), 2); // Mínimo 2 minutos
          
          console.log(`📍 Conductor ${conductorSeleccionado.nombre} está a ${distancia.toFixed(2)} km del origen`);
          console.log(`⏱️ Tiempo estimado: ${tiempoEstimado} minutos`);
        } catch (error) {
          console.error('Error calculando tiempo real, usando tiempo simulado:', error);
          tiempoEstimado = inmediato ? 
            Math.floor(Math.random() * 300) + 300 : // 5-10 minutos para inmediato
            Math.floor(Math.random() * 600) + 600;  // 10-20 minutos para no inmediato
        }
      } else {
        // Tiempo simulado si no hay origen o posición
        tiempoEstimado = inmediato ? 
          Math.floor(Math.random() * 300) + 300 : // 5-10 minutos para inmediato
          Math.floor(Math.random() * 600) + 600;  // 10-20 minutos para no inmediato
      }

      return {
        duracion: tiempoEstimado,
        duracionText: `${Math.floor(tiempoEstimado / 60)} mins`,
        conductor: {
          id: conductorSeleccionado.id,
          nombre: conductorSeleccionado.nombre,
          apellidos: conductorSeleccionado.apellidos,
          matricula: conductorSeleccionado.matricula
        }
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al calcular el tiempo estimado');
    }
  }

  /**
   * Calcula la distancia desde las coordenadas del conductor hasta el origen del servicio
   */
  private async calcularDistanciaDesdeConductor(latConductor: number, lonConductor: number, direccionOrigen: string): Promise<number> {
    try {
      // Obtener coordenadas del origen usando geocodificación
      const coordenadasOrigen = await this.obtenerCoordenadas(direccionOrigen);
      
      const latOrigen = parseFloat(coordenadasOrigen.lat);
      const lonOrigen = parseFloat(coordenadasOrigen.lng);
      
      // Calcular distancia usando fórmula de Haversine
      const R = 6371; // Radio de la Tierra en km
      const dLat = this.toRadians(latOrigen - latConductor);
      const dLon = this.toRadians(lonOrigen - lonConductor);
      
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(latConductor)) * Math.cos(this.toRadians(latOrigen)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    } catch (error) {
      console.error('Error calculando distancia desde conductor:', error);
      return 5; // Distancia por defecto si falla el cálculo
    }
  }



  private toRadians(grados: number): number {
    return grados * (Math.PI / 180);
  }
} 