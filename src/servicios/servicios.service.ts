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

    // Obtener coordenadas automáticamente si no se proporcionan
    let coordenadasServicio;
    try {
      coordenadasServicio = await this.obtenerCoordenadasServicio(dto.origen, dto.destino);
      console.log('Coordenadas obtenidas automáticamente:', coordenadasServicio);
    } catch (error) {
      console.error('Error obteniendo coordenadas automáticamente:', error);
      // Si falla la geocodificación, usar coordenadas por defecto o las proporcionadas
      coordenadasServicio = {
        origenLat: dto.origenLat || '0',
        origenLon: dto.origenLon || '0',
        destinoLat: dto.destinoLat || '0',
        destinoLon: dto.destinoLon || '0'
      };
    }

    // Calcular precio automáticamente usando la API de tarifas
    let precioCalculado: number;
    try {
      const resultadoPrecio = await this.tarifasService.calcularPrecio({
        origen: dto.origen,
        destino: dto.destino,
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
      return await this.serviciosRepository.save(servicio);
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
  async getTiempoEstimado(inmediato: boolean = false): Promise<any> {
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
        .andWhere('(conductor.ultimaPenalizacion IS NULL OR conductor.ultimaPenalizacion < :ahora)', { ahora }) // No penalizado
        .andWhere('posicion.id IS NOT NULL'); // Con posición registrada

      const conductoresDisponibles = await queryBuilder.getMany();

      if (conductoresDisponibles.length === 0) {
        throw new NotFoundException('No hay conductores disponibles en este momento');
      }

      // Seleccionar el primer conductor disponible
      const conductorSeleccionado = conductoresDisponibles[0];
      
      // Simular tiempo de llegada
      const tiempoEstimado = inmediato ? 
        Math.floor(Math.random() * 300) + 300 : // 5-10 minutos para inmediato
        Math.floor(Math.random() * 600) + 600;  // 10-20 minutos para no inmediato

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
} 