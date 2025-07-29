import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarifa } from './entities/tarifa.entity';
import { Festivo } from './entities/festivo.entity';
import { CrearTarifaDto } from './dto/crear-tarifa.dto';
import { ActualizarTarifaDto } from './dto/actualizar-tarifa.dto';
import { CalcularPrecioDto } from './dto/calcular-precio.dto';
import { GeolocalizacionService } from './geolocalizacion.service';

@Injectable()
export class TarifasService {
  constructor(
    @InjectRepository(Tarifa)
    private tarifasRepository: Repository<Tarifa>,
    @InjectRepository(Festivo)
    private festivosRepository: Repository<Festivo>,
    private geolocalizacionService: GeolocalizacionService,
  ) {}

  // CRUD Tarifas
  async crear(crearTarifaDto: CrearTarifaDto): Promise<Tarifa> {
    const tarifa = this.tarifasRepository.create(crearTarifaDto);
    return await this.tarifasRepository.save(tarifa);
  }

  async obtenerTodas(): Promise<Tarifa[]> {
    return await this.tarifasRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  async obtenerActivas(): Promise<Tarifa[]> {
    return await this.tarifasRepository.find({
      where: { activa: true },
      order: { created_at: 'DESC' }
    });
  }

  async obtenerPorId(id: number): Promise<Tarifa> {
    const tarifa = await this.tarifasRepository.findOne({ where: { id } });
    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }
    return tarifa;
  }

  async actualizar(id: number, actualizarTarifaDto: ActualizarTarifaDto): Promise<Tarifa> {
    const tarifa = await this.obtenerPorId(id);
    Object.assign(tarifa, actualizarTarifaDto);
    return await this.tarifasRepository.save(tarifa);
  }

  async eliminar(id: number): Promise<void> {
    const tarifa = await this.obtenerPorId(id);
    await this.tarifasRepository.remove(tarifa);
  }

  // CRUD Festivos
  async crearFestivo(crearFestivoDto: any): Promise<Festivo> {
    const festivo = this.festivosRepository.create(crearFestivoDto);
    const resultado = await this.festivosRepository.save(festivo);
    return Array.isArray(resultado) ? resultado[0] : resultado;
  }

  async obtenerFestivos(): Promise<Festivo[]> {
    return await this.festivosRepository.find({
      where: { activo: true },
      order: { fecha: 'ASC' }
    });
  }

  async obtenerFestivoPorId(id: number): Promise<Festivo> {
    const festivo = await this.festivosRepository.findOne({ where: { id } });
    if (!festivo) {
      throw new NotFoundException(`Festivo con ID ${id} no encontrado`);
    }
    return festivo;
  }

  async actualizarFestivo(id: number, actualizarFestivoDto: any): Promise<Festivo> {
    const festivo = await this.obtenerFestivoPorId(id);
    Object.assign(festivo, actualizarFestivoDto);
    return await this.festivosRepository.save(festivo);
  }

  async eliminarFestivo(id: number): Promise<void> {
    const festivo = await this.obtenerFestivoPorId(id);
    await this.festivosRepository.remove(festivo);
  }

  // Lógica de cálculo de precios con geolocalización
  async calcularPrecio(calcularPrecioDto: CalcularPrecioDto): Promise<any> {
    const { origen, destino, fecha, hora, tipo_servicio = 'normal', zona } = calcularPrecioDto;

    // Validar direcciones
    const origenValido = await this.geolocalizacionService.validarDireccion(origen);
    const destinoValido = await this.geolocalizacionService.validarDireccion(destino);

    if (!origenValido) {
      throw new NotFoundException(`Dirección de origen no válida: ${origen}`);
    }

    if (!destinoValido) {
      throw new NotFoundException(`Dirección de destino no válida: ${destino}`);
    }

    // Calcular distancia
    const resultadoDistancia = await this.geolocalizacionService.calcularDistancia(origen, destino);
    
    // Obtener fecha y hora actual si no se proporcionan
    let fechaActual: Date;
    try {
      fechaActual = fecha ? new Date(fecha) : new Date();
      // Validar que la fecha sea válida
      if (isNaN(fechaActual.getTime())) {
        fechaActual = new Date();
      }
    } catch (error) {
      fechaActual = new Date();
    }
    
    const horaActual = hora || this.obtenerHoraActual();
    
    // Verificar si es festivo
    const esFestivo = await this.esFestivo(fechaActual);
    
    // Obtener día de la semana (1 = Lunes, 7 = Domingo)
    const diaSemana = fechaActual.getDay() === 0 ? 7 : fechaActual.getDay();
    
    // Buscar tarifa aplicable
    const tarifaAplicable = await this.buscarTarifaAplicable({
      diaSemana,
      hora: horaActual,
      esFestivo,
      tipo_servicio,
      zona,
      distancia_km: resultadoDistancia.distancia_km
    });

    if (!tarifaAplicable) {
      throw new NotFoundException('No se encontró una tarifa aplicable para los parámetros dados');
    }

    // Calcular precio
    const tarifaPorKm = parseFloat(tarifaAplicable.tarifa_por_km.toString());
    const costoBase = parseFloat(tarifaAplicable.costo_base.toString());
    
    console.log('💰 Cálculo de precio:');
    console.log(`   Distancia: ${resultadoDistancia.distancia_km} km`);
    console.log(`   Tarifa por km: $${tarifaPorKm}`);
    console.log(`   Costo base: $${costoBase}`);
    
    const precioBase = resultadoDistancia.distancia_km * tarifaPorKm;
    const precioTotal = precioBase + costoBase;
    
    console.log(`   Precio base: $${precioBase.toFixed(2)}`);
    console.log(`   Precio total: $${precioTotal.toFixed(2)}`);
    
    // Redondear al múltiplo de 0.05 más cercano hacia arriba
    const precioFinal = Math.ceil(precioTotal * 20) / 20;
    
    console.log(`   Precio final: $${precioFinal.toFixed(2)}`);

    return {
      precio: precioFinal,
      distancia_km: resultadoDistancia.distancia_km,
      tiempo_estimado_minutos: resultadoDistancia.tiempo_minutos,
      tarifa_por_km: tarifaAplicable.tarifa_por_km,
      costo_base: tarifaAplicable.costo_base,
      tarifa_aplicada: tarifaAplicable.nombre,
      es_festivo: esFestivo,
      dia_semana: diaSemana,
      hora: horaActual,
      tipo_servicio,
      zona,
      origen,
      destino,
      metodo_calculo_distancia: resultadoDistancia.metodo
    };
  }

  private async esFestivo(fecha: Date): Promise<boolean> {
    try {
      // Validar que la fecha sea válida
      if (isNaN(fecha.getTime())) {
        return false;
      }
      
      const fechaFormateada = fecha.toISOString().split('T')[0];
      const festivo = await this.festivosRepository.findOne({
        where: {
          fecha: fechaFormateada as any,
          activo: true
        }
      });
      return !!festivo;
    } catch (error) {
      console.error('Error verificando festivo:', error);
      return false;
    }
  }

  private obtenerHoraActual(): string {
    const ahora = new Date();
    return `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;
  }

  private async buscarTarifaAplicable(params: {
    diaSemana: number;
    hora: string;
    esFestivo: boolean;
    tipo_servicio: string;
    zona?: string;
    distancia_km: number;
  }): Promise<Tarifa | null> {
    const { diaSemana, hora, esFestivo, tipo_servicio, zona, distancia_km } = params;

    console.log('🔍 Buscando tarifa aplicable con parámetros:', {
      diaSemana,
      hora,
      esFestivo,
      tipo_servicio,
      zona,
      distancia_km
    });

    const tarifas = await this.tarifasRepository.find({
      where: { activa: true }
    });

    console.log(`📋 Tarifas activas encontradas: ${tarifas.length}`);

    for (const tarifa of tarifas) {
      console.log(`\n🔍 Evaluando tarifa: ${tarifa.nombre}`);
      console.log(`   Condiciones:`, tarifa.condiciones);
      
      if (!tarifa.condiciones) {
        console.log(`   ❌ Sin condiciones, saltando`);
        continue;
      }

      const condiciones = tarifa.condiciones;
      
      // Verificar días de la semana
      if (condiciones.dias_semana && !condiciones.dias_semana.includes(diaSemana)) {
        console.log(`   ❌ Día de semana no coincide. Requerido: ${condiciones.dias_semana}, Actual: ${diaSemana}`);
        continue;
      }

      // Verificar horario
      if (condiciones.horario_inicio && condiciones.horario_fin) {
        if (hora < condiciones.horario_inicio || hora > condiciones.horario_fin) {
          console.log(`   ❌ Horario no coincide. Requerido: ${condiciones.horario_inicio}-${condiciones.horario_fin}, Actual: ${hora}`);
          continue;
        }
      }

      // Verificar festivos
      if (condiciones.festivos !== undefined && condiciones.festivos !== esFestivo) {
        console.log(`   ❌ Condición de festivo no coincide. Requerido: ${condiciones.festivos}, Actual: ${esFestivo}`);
        continue;
      }

      // Verificar zona especial
      if (condiciones.zona_especial && zona !== condiciones.zona_especial) {
        console.log(`   ❌ Zona no coincide. Requerido: ${condiciones.zona_especial}, Actual: ${zona}`);
        continue;
      }

      // Verificar tipo de servicio
      if (condiciones.tipo_servicio && !condiciones.tipo_servicio.includes(tipo_servicio)) {
        console.log(`   ❌ Tipo de servicio no coincide. Requerido: ${condiciones.tipo_servicio}, Actual: ${tipo_servicio}`);
        continue;
      }

      // Verificar distancia
      if (condiciones.distancia_minima && distancia_km < condiciones.distancia_minima) {
        console.log(`   ❌ Distancia mínima no cumple. Requerido: >=${condiciones.distancia_minima}, Actual: ${distancia_km}`);
        continue;
      }

      if (condiciones.distancia_maxima && distancia_km > condiciones.distancia_maxima) {
        console.log(`   ❌ Distancia máxima no cumple. Requerido: <=${condiciones.distancia_maxima}, Actual: ${distancia_km}`);
        continue;
      }

      console.log(`   ✅ Tarifa aplicable encontrada: ${tarifa.nombre}`);
      return tarifa;
    }

    console.log(`❌ No se encontró tarifa aplicable`);
    return null;
  }

  // Métodos de utilidad
  async obtenerFestivosPorAnio(anio: number): Promise<Festivo[]> {
    const inicioAnio = new Date(anio, 0, 1);
    const finAnio = new Date(anio, 11, 31);
    
    return await this.festivosRepository
      .createQueryBuilder('festivo')
      .where('festivo.fecha BETWEEN :inicio AND :fin', { inicio: inicioAnio, fin: finAnio })
      .andWhere('festivo.activo = :activo', { activo: true })
      .orderBy('festivo.fecha', 'ASC')
      .getMany();
  }

  async verificarFestivo(fecha: Date): Promise<Festivo | null> {
    const fechaFormateada = fecha.toISOString().split('T')[0];
    return await this.festivosRepository.findOne({
      where: {
        fecha: fechaFormateada as any,
        activo: true
      }
    });
  }

  // Métodos adicionales para geolocalización
  async validarDireccion(direccion: string): Promise<boolean> {
    return await this.geolocalizacionService.validarDireccion(direccion);
  }

  async obtenerInformacionDireccion(direccion: string): Promise<any> {
    return await this.geolocalizacionService.obtenerInformacionDireccion(direccion);
  }

  // Método temporal para configurar la base de datos
  async setupDatabase(): Promise<any> {
    try {
      // Crear tabla de tarifas si no existe
      await this.tarifasRepository.query(`
        CREATE TABLE IF NOT EXISTS tarifas (
          id INT PRIMARY KEY AUTO_INCREMENT,
          nombre VARCHAR(100) NOT NULL,
          descripcion TEXT,
          tarifa_por_km DECIMAL(10,2) NOT NULL,
          costo_base DECIMAL(10,2) DEFAULT 5.00,
          activa BOOLEAN DEFAULT TRUE,
          fecha_inicio DATE,
          fecha_fin DATE,
          condiciones JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Crear tabla de festivos si no existe
      await this.festivosRepository.query(`
        CREATE TABLE IF NOT EXISTS festivos (
          id INT PRIMARY KEY AUTO_INCREMENT,
          fecha DATE NOT NULL UNIQUE,
          nombre VARCHAR(100) NOT NULL,
          descripcion TEXT,
          activo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Verificar si ya existen tarifas
      const tarifasExistentes = await this.tarifasRepository.count();
      if (tarifasExistentes === 0) {
        // Insertar tarifas de ejemplo
        await this.tarifasRepository.query(`
          INSERT INTO tarifas (nombre, descripcion, tarifa_por_km, condiciones) VALUES 
          (
            'Tarifa Normal',
            'Tarifa estándar para días laborales en horario normal',
            1.25,
            '{"dias_semana": [1,2,3,4,5], "horario_inicio": "07:00", "horario_fin": "21:00", "festivos": false, "zona_especial": false, "tipo_servicio": ["normal"], "distancia_minima": 0, "distancia_maxima": null}'
          ),
          (
            'Tarifa Especial',
            'Tarifa para fines de semana, festivos y horario nocturno',
            1.50,
            '{"dias_semana": [6,7], "horario_inicio": "00:00", "horario_fin": "23:59", "festivos": true, "zona_especial": false, "tipo_servicio": ["normal"], "distancia_minima": 0, "distancia_maxima": null}'
          ),
          (
            'Tarifa Nocturna',
            'Tarifa para horario nocturno en días laborales',
            1.50,
            '{"dias_semana": [1,2,3,4,5], "horario_inicio": "21:00", "horario_fin": "07:00", "festivos": false, "zona_especial": false, "tipo_servicio": ["normal"], "distancia_minima": 0, "distancia_maxima": null}'
          )
        `);
      }

      // Verificar si ya existen festivos
      const festivosExistentes = await this.festivosRepository.count();
      if (festivosExistentes === 0) {
        // Insertar festivos de ejemplo
        await this.festivosRepository.query(`
          INSERT INTO festivos (fecha, nombre, descripcion) VALUES
          ('2024-01-01', 'Año Nuevo', 'Celebración del año nuevo'),
          ('2024-01-06', 'Día de Reyes', 'Epifanía del Señor'),
          ('2024-02-12', 'Carnaval', 'Festividad de carnaval'),
          ('2024-02-13', 'Carnaval', 'Festividad de carnaval'),
          ('2024-03-24', 'Día de la Memoria', 'Día nacional de la memoria'),
          ('2024-04-02', 'Día del Veterano', 'Día del veterano y de los caídos en la guerra de Malvinas'),
          ('2024-05-01', 'Día del Trabajador', 'Día internacional del trabajador'),
          ('2024-05-25', 'Día de la Revolución', 'Día de la revolución de mayo'),
          ('2024-06-20', 'Día de la Bandera', 'Día de la bandera nacional'),
          ('2024-07-09', 'Día de la Independencia', 'Día de la independencia argentina'),
          ('2024-08-17', 'Día del Libertador', 'Muerte del general José de San Martín'),
          ('2024-10-12', 'Día del Respeto', 'Día del respeto a la diversidad cultural'),
          ('2024-11-20', 'Día de la Soberanía', 'Día de la soberanía nacional'),
          ('2024-12-08', 'Inmaculada Concepción', 'Día de la inmaculada concepción de María'),
          ('2024-12-25', 'Navidad', 'Celebración de la navidad')
        `);
      }

      return {
        message: 'Base de datos configurada correctamente',
        tarifas_creadas: await this.tarifasRepository.count(),
        festivos_creados: await this.festivosRepository.count()
      };
    } catch (error) {
      throw new Error(`Error configurando base de datos: ${error.message}`);
    }
  }
} 