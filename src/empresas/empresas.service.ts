import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CrearEmpresaDto } from './dto/crear-empresa.dto';
import { ActualizarEmpresaDto } from './dto/actualizar-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresasRepository: Repository<Empresa>,
  ) {}

  async registrar(dto: CrearEmpresaDto) {
    if (!dto || !dto.nombre) {
      throw new BadRequestException('Falta el nombre de la empresa');
    }
    try {
      const existe = await this.empresasRepository.findOne({ where: { nombre: dto.nombre } });
      if (existe) {
        throw new BadRequestException('El nombre ya está asociado a una empresa');
      }
      const fechaActual = new Date();
      const empresa = this.empresasRepository.create({
        ...dto,
        cc: dto.cc || 0, // Usar valor por defecto si no se proporciona
        created_at: fechaActual,
        updated_at: fechaActual, // Agregar explícitamente
      });
      return await this.empresasRepository.save(empresa);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla empresas no existe en la base de datos.');
      }
      throw error;
    }
  }

  async actualizar(id: number, dto: ActualizarEmpresaDto): Promise<Empresa> {
    const empresa = await this.empresasRepository.findOne({ where: { id } });
    if (!empresa) throw new BadRequestException('Empresa no encontrada');
    Object.assign(empresa, dto, { updated_at: new Date() });
    return this.empresasRepository.save(empresa);
  }

  async getLista(): Promise<Empresa[]> {
    return this.empresasRepository.find();
  }

  async getByNombre(nombre: string): Promise<Empresa> {
    const empresa = await this.empresasRepository.findOne({ where: { nombre } });
    if (!empresa) throw new BadRequestException('Empresa no encontrada');
    return empresa;
  }
} 