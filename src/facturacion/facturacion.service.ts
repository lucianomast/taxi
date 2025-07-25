import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { CrearFacturaDto } from './dto/crear-factura.dto';
import { ActualizarFacturaDto } from './dto/actualizar-factura.dto';
import { Servicio } from '../servicios/entities/servicio.entity';

@Injectable()
export class FacturacionService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturasRepository: Repository<Factura>,
    @InjectRepository(Servicio)
    private readonly serviciosRepository: Repository<Servicio>,
  ) {}

  async crear(dto: CrearFacturaDto) {
    const servicio = await this.serviciosRepository.findOne({ where: { id: dto.servicioId } });
    if (!servicio) {
      throw new NotFoundException('No se ha encontrado un servicio con ese id');
    }
    try {
      const factura = this.facturasRepository.create({
        ...dto,
        created_at: new Date(),
      });
      return await this.facturasRepository.save(factura);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes("doesn't exist")) {
        throw new InternalServerErrorException('La tabla facturas no existe en la base de datos.');
      }
      throw error;
    }
  }

  async actualizar(id: number, dto: ActualizarFacturaDto): Promise<Factura> {
    const factura = await this.facturasRepository.findOne({ where: { id } });
    if (!factura) throw new NotFoundException('Factura no encontrada');
    Object.assign(factura, dto, { updated_at: new Date() });
    return this.facturasRepository.save(factura);
  }

  async getLista(): Promise<Factura[]> {
    return this.facturasRepository.find();
  }

  async getById(id: number): Promise<Factura> {
    const factura = await this.facturasRepository.findOne({ where: { id } });
    if (!factura) throw new NotFoundException('Factura no encontrada');
    return factura;
  }
} 