import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CrearServicioDto } from './dto/crear-servicio.dto';
import { ActualizarServicioDto } from './dto/actualizar-servicio.dto';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Conductor } from '../conductores/entities/conductor.entity';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly serviciosRepository: Repository<Servicio>,
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
    @InjectRepository(Conductor)
    private readonly conductoresRepository: Repository<Conductor>,
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
    try {
      const servicio = this.serviciosRepository.create({
        ...dto,
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
} 