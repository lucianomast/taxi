import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { CrearFacturaDto } from './dto/crear-factura.dto';
import { ActualizarFacturaDto } from './dto/actualizar-factura.dto';
import { FiltrarFacturaDto } from './dto/filtrar-factura.dto';
import { Servicio } from '../servicios/entities/servicio.entity';
import { EmailService } from '../email/email.service';
import { ESTADO_SERVICIO_DESCRIPCION } from '../servicios/enums/estado-servicio.enum';
import * as XLSX from 'xlsx';

@Injectable()
export class FacturacionService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturasRepository: Repository<Factura>,
    @InjectRepository(Servicio)
    private readonly serviciosRepository: Repository<Servicio>,
    private readonly emailService: EmailService,
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

  async filtrarYGenerarExcel(dto: FiltrarFacturaDto): Promise<{ success: boolean; message: string }> {
    try {
      // Construir la consulta con filtros
      const queryBuilder = this.facturasRepository
        .createQueryBuilder('factura')
        .leftJoinAndSelect('factura.servicio', 'servicio')
        .leftJoinAndSelect('servicio.cliente', 'cliente')
        .leftJoinAndSelect('servicio.conductor', 'conductor');

      // Aplicar filtros de fecha
      if (dto.filtros.fechaDesde) {
        queryBuilder.andWhere('factura.fecha >= :fechaDesde', { 
          fechaDesde: dto.filtros.fechaDesde 
        });
      }

      if (dto.filtros.fechaHasta) {
        queryBuilder.andWhere('factura.fecha <= :fechaHasta', { 
          fechaHasta: dto.filtros.fechaHasta 
        });
      }

      // Aplicar filtro por cliente
      if (dto.filtros.clienteid) {
        queryBuilder.andWhere('servicio.clienteId = :clienteId', { 
          clienteId: dto.filtros.clienteid 
        });
      }

      // Aplicar filtro por conductor
      if (dto.filtros.conductorid) {
        queryBuilder.andWhere('servicio.conductorId = :conductorId', { 
          conductorId: dto.filtros.conductorid 
        });
      }

      // Ejecutar la consulta
      const facturas = await queryBuilder.getMany();

      if (facturas.length === 0) {
        return {
          success: false,
          message: 'No se encontraron facturas con los filtros especificados'
        };
      }

      // Preparar datos para Excel
      const datosExcel = facturas.map(factura => ({
        'ID Factura': factura.id,
        'ID Servicio': factura.servicioId,
        'Importe': factura.importe,
        'Fecha': factura.fecha,
        'Cliente': factura.clienteNombre || 'N/A',
        'Empresa': factura.empresaNombre || 'N/A',
        'Origen': factura.servicio?.origen || 'N/A',
        'Destino': factura.servicio?.destino || 'N/A',
        'Conductor': factura.servicio?.conductor?.nombre || 'N/A',
        'Estado Servicio': factura.servicio?.estado ? 
          `${factura.servicio.estado} (${ESTADO_SERVICIO_DESCRIPCION[factura.servicio.estado] || 'Desconocido'})` : 'N/A',
        'Fecha Creación': factura.created_at,
        'Fecha Actualización': factura.updated_at || 'N/A'
      }));

      // Crear workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(datosExcel);

      // Configurar anchos de columna
      const columnWidths = [
        { wch: 10 }, // ID Factura
        { wch: 10 }, // ID Servicio
        { wch: 12 }, // Importe
        { wch: 12 }, // Fecha
        { wch: 20 }, // Cliente
        { wch: 20 }, // Empresa
        { wch: 30 }, // Origen
        { wch: 30 }, // Destino
        { wch: 20 }, // Conductor
        { wch: 15 }, // Estado Servicio
        { wch: 15 }, // Fecha Creación
        { wch: 15 }  // Fecha Actualización
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas');

      // Generar buffer del archivo
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Generar nombre del archivo
      const fechaActual = new Date().toISOString().split('T')[0];
      const filename = `facturas_${fechaActual}.xlsx`;

      // Enviar por email
      const emailEnviado = await this.emailService.enviarFacturasExcel(
        dto.usermail, 
        buffer, 
        filename, 
        dto.filtros
      );

      if (emailEnviado) {
        return {
          success: true,
          message: `Reporte de facturas enviado exitosamente a ${dto.usermail}. Se encontraron ${facturas.length} facturas.`
        };
      } else {
        return {
          success: false,
          message: 'Error al enviar el email con el reporte de facturas'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error al generar el reporte: ${error.message}`
      };
    }
  }
} 