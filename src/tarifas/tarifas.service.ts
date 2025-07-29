import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarifa } from './entities/tarifa.entity';
import { Festivo } from './entities/festivo.entity';
import { CrearTarifaDto } from './dto/crear-tarifa.dto';
import { ActualizarTarifaDto } from './dto/actualizar-tarifa.dto';
import { CalcularPrecioDto } from './dto/calcular-precio.dto';

@Injectable()
export class TarifasService {
  constructor(
    @InjectRepository(Tarifa)
    private tarifasRepository: Repository<Tarifa>,
    @InjectRepository(Festivo)
    private festivosRepository: Repository<Festivo>,
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
    return await this.festivosRepository.save(festivo);
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

  // Lógica de cálculo de precios
  async calcularPrecio(calcularPrecioDto: CalcularPrecioDto): Promise<any> {
    const { distancia_km, fecha, hora, tipo_servicio = 'normal', zona } = calcularPrecioDto;
    
    // Obtener fecha y hora actual si no se proporcionan
    const fechaActual = fecha || new Date();
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
      distancia_km
    });

    if (!tarifaAplicable) {
      throw new NotFoundException('No se encontró una tarifa aplicable para los parámetros dados');
    }

    // Calcular precio
    const precioBase = distancia_km * tarifaAplicable.tarifa_por_km;
    const precioTotal = precioBase + tarifaAplicable.costo_base;
    
    // Redondear al múltiplo de 0.05 más cercano hacia arriba
    const precioFinal = Math.ceil(precioTotal * 20) / 20;

    return {
      precio: precioFinal,
      distancia_km,
      tarifa_por_km: tarifaAplicable.tarifa_por_km,
      costo_base: tarifaAplicable.costo_base,
      tarifa_aplicada: tarifaAplicable.nombre,
      es_festivo: esFestivo,
      dia_semana: diaSemana,
      hora: horaActual,
      tipo_servicio,
      zona
    };
  }

  private async esFestivo(fecha: Date): Promise<boolean> {
    const fechaFormateada = fecha.toISOString().split('T')[0];
    const festivo = await this.festivosRepository.findOne({
      where: {
        fecha: fechaFormateada,
        activo: true
      }
    });
    return !!festivo;
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

    const tarifas = await this.tarifasRepository.find({
      where: { activa: true }
    });

    for (const tarifa of tarifas) {
      if (!tarifa.condiciones) continue;

      const condiciones = tarifa.condiciones;
      
      // Verificar días de la semana
      if (condiciones.dias_semana && !condiciones.dias_semana.includes(diaSemana)) {
        continue;
      }

      // Verificar horario
      if (condiciones.horario_inicio && condiciones.horario_fin) {
        if (hora < condiciones.horario_inicio || hora > condiciones.horario_fin) {
          continue;
        }
      }

      // Verificar festivos
      if (condiciones.festivos !== undefined && condiciones.festivos !== esFestivo) {
        continue;
      }

      // Verificar tipo de servicio
      if (condiciones.tipo_servicio && !condiciones.tipo_servicio.includes(tipo_servicio)) {
        continue;
      }

      // Verificar zona
      if (condiciones.zona_especial && !zona) {
        continue;
      }

      // Verificar distancia
      if (condiciones.distancia_minima && distancia_km < condiciones.distancia_minima) {
        continue;
      }
      if (condiciones.distancia_maxima && distancia_km > condiciones.distancia_maxima) {
        continue;
      }

      // Si llegamos aquí, esta tarifa es aplicable
      return tarifa;
    }

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
        fecha: fechaFormateada,
        activo: true
      }
    });
  }
} 