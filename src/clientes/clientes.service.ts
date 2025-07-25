import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { CrearClienteDto } from './dto/crear-cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
    @InjectRepository(Empresa)
    private readonly empresasRepository: Repository<Empresa>,
  ) {}

  async registrar(dto: CrearClienteDto): Promise<Cliente> {
    if (dto.empresaId) {
      const empresa = await this.empresasRepository.findOne({ where: { id: dto.empresaId } });
      if (!empresa) {
        throw new NotFoundException('No se ha encontrado una empresa con ese id');
      }
    }
    const existe = await this.clientesRepository.findOne({ where: { telefono: dto.telefono } });
    if (existe) {
      throw new BadRequestException('El telefono ya está asociado a un cliente');
    }
    const cliente = this.clientesRepository.create({
      ...dto,
      created_at: new Date(),
    });
    return this.clientesRepository.save(cliente);
  }

  async actualizar(id: number, dto: ActualizarClienteDto): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    Object.assign(cliente, dto, { updated_at: new Date() });
    return this.clientesRepository.save(cliente);
  }

  async getLista(): Promise<Cliente[]> {
    return this.clientesRepository.find();
  }

  async getUser(telefono: string): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({ where: { telefono } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }
} 