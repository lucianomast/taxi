import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Conductor } from './entities/conductor.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { CrearConductorDto } from './dto/crear-conductor.dto';
import { ActualizarConductorDto } from './dto/actualizar-conductor.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ConductoresService {
  constructor(
    @InjectRepository(Conductor)
    private readonly conductoresRepository: Repository<Conductor>,
    @InjectRepository(Empresa)
    private readonly empresasRepository: Repository<Empresa>,
  ) {}

  async registrar(dto: CrearConductorDto): Promise<Conductor> {
    const empresa = await this.empresasRepository.findOne({ where: { id: dto.idProveedor } });
    if (!empresa) {
      throw new NotFoundException('No se ha encontrado una empresa con ese id');
    }
    try {
      const existeDni = await this.conductoresRepository.findOne({ where: { dni: dto.dni } });
      if (existeDni) {
        throw new BadRequestException('El DNI ya está asociado a un conductor');
      }
      const existeEmail = await this.conductoresRepository.findOne({ where: { email: dto.email } });
      if (existeEmail) {
        throw new BadRequestException('El email ya está asociado a un conductor');
      }
      // Hashear la contraseña antes de guardar
      const salt = await bcrypt.genSalt(10);
      dto.password = await bcrypt.hash(dto.password, salt);
      const conductor = this.conductoresRepository.create({
        ...dto,
        created_at: new Date(),
      });
      return await this.conductoresRepository.save(conductor);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla conductores no existe en la base de datos.');
      }
      throw error;
    }
  }

  async actualizar(id: number, dto: ActualizarConductorDto): Promise<Conductor> {
    try {
      const conductor = await this.conductoresRepository.findOne({ where: { id } });
      if (!conductor) throw new NotFoundException('Conductor no encontrado');
      Object.assign(conductor, dto, { updated_at: new Date() });
      return await this.conductoresRepository.save(conductor);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla conductores no existe en la base de datos.');
      }
      throw error;
    }
  }

  async getLista(): Promise<Conductor[]> {
    try {
      return await this.conductoresRepository.find();
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla conductores no existe en la base de datos.');
      }
      throw error;
    }
  }

  async getByDni(dni: string): Promise<Conductor> {
    try {
      const conductor = await this.conductoresRepository.findOne({ where: { dni } });
      if (!conductor) throw new NotFoundException('Conductor no encontrado');
      return conductor;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla conductores no existe en la base de datos.');
      }
      throw error;
    }
  }

  async cambiarPassword(id: number, password: string) {
    const conductor = await this.conductoresRepository.findOne({ where: { id } });
    if (!conductor) {
      throw new NotFoundException('No se encontró el conductor');
    }
    const salt = await bcrypt.genSalt(10);
    conductor.password = await bcrypt.hash(password, salt);
    await this.conductoresRepository.save(conductor);
    const respuesta = { success: true, message: 'Contraseña actualizada correctamente' };
    console.log('Respuesta cambiar_password:', respuesta);
    return respuesta;
  }
} 