import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { CrearClienteDto } from './dto/crear-cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';
import { GetLocationDto } from './dto/get-location.dto';
import { EmailService } from '../email/email.service';
import * as NodeGeocoder from 'node-geocoder';
import * as XLSX from 'xlsx';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
    @InjectRepository(Empresa)
    private readonly empresasRepository: Repository<Empresa>,
    private readonly emailService: EmailService,
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

  async getLocation(address: string): Promise<any> {
    try {
      // Configurar el geocoder con OpenStreetMap (gratuito)
      const options: any = {
        provider: 'openstreetmap',
        formatter: null
      };

      const geocoder = NodeGeocoder(options);
      
      // Realizar la geocodificación
      const results = await geocoder.geocode(address);
      
      if (!results || results.length === 0) {
        throw new NotFoundException('No se encontraron coordenadas para esta dirección');
      }

      const result = results[0];
      
      return {
        address: address,
        lat: result.latitude,
        lng: result.longitude,
        formattedAddress: result.formattedAddress,
        country: result.country,
        city: result.city,
        state: result.state,
        zipcode: result.zipcode,
        streetName: result.streetName,
        streetNumber: result.streetNumber
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener las coordenadas de la dirección');
    }
  }

  async exportarClientes(emailDestino: string): Promise<any> {
    try {
      // Obtener todos los clientes
      const clientes = await this.clientesRepository.find({
        order: { created_at: 'DESC' }
      });

      if (clientes.length === 0) {
        throw new BadRequestException('No hay clientes para exportar');
      }

      // Preparar datos para Excel
      const datosExcel = clientes.map(cliente => ({
        'ID': cliente.id,
        'Nombre': cliente.nombre,
        'Apellidos': cliente.apellidos || '',
        'Teléfono': cliente.telefono,
        'Prefijo': cliente.prefijo || '',
        'Email': cliente.email || '',
        'Dirección Habitual': cliente.direccionHabitual || '',
        'Información Cliente': cliente.informacionCliente || '',
        'Información Adicional': cliente.informacionAdicional || '',
        'Estado Usuario': cliente.estadoUsuario,
        'Ocultar Teléfono': cliente.ocultarTelefono ? 'Sí' : 'No',
        'Empresa ID': cliente.empresaId || '',
        'Latitud': cliente.lat || '',
        'Longitud': cliente.lon || '',
        'Fecha Creación': cliente.created_at,
        'Fecha Actualización': cliente.updated_at || '',
        'Fecha Eliminación': cliente.deleted_at || ''
      }));

      // Crear workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(datosExcel);

      // Ajustar ancho de columnas
      const columnWidths = [
        { wch: 8 },   // ID
        { wch: 20 },  // Nombre
        { wch: 25 },  // Apellidos
        { wch: 15 },  // Teléfono
        { wch: 8 },   // Prefijo
        { wch: 30 },  // Email
        { wch: 40 },  // Dirección
        { wch: 30 },  // Info Cliente
        { wch: 30 },  // Info Adicional
        { wch: 15 },  // Estado
        { wch: 15 },  // Ocultar Teléfono
        { wch: 12 },  // Empresa ID
        { wch: 15 },  // Latitud
        { wch: 15 },  // Longitud
        { wch: 20 },  // Fecha Creación
        { wch: 20 },  // Fecha Actualización
        { wch: 20 }   // Fecha Eliminación
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

      // Generar nombre de archivo con fecha
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `clientes_${fecha}.xlsx`;

      // Convertir a buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Enviar por email
      await this.emailService.enviarClientesExcel(emailDestino, buffer, nombreArchivo);

      return {
        success: true,
        message: `Lista de clientes exportada y enviada exitosamente a ${emailDestino}`,
        totalClientes: clientes.length,
        archivoGenerado: nombreArchivo
      };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al exportar clientes: ' + error.message);
    }
  }
} 