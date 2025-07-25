import { Controller, Post, Body, Put, Param, Get, Query } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CrearEmpresaDto } from './dto/crear-empresa.dto';
import { ActualizarEmpresaDto } from './dto/actualizar-empresa.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('empresas')
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post('registrar')
  @ApiOperation({ summary: 'Registrar una nueva empresa' })
  @ApiBody({ type: CrearEmpresaDto })
  @ApiResponse({
    status: 201,
    description: 'Empresa registrada correctamente',
    schema: {
      example: {
        id: 4,
        nombre: 'DemoCorp S.A.',
        cif: 'A12345678',
        abonado: true,
        razonSocial: 'DemoCorp Soluciones Integrales',
        domicilioFiscal: 'Calle Ficción 123, Zona Beta, Madrid',
        contacto1: 'Ana Duarte',
        tlf1: '600100100',
        email1: 'ana@democorp.test',
        facturacion: 'NINGUNA',
        observaciones: '',
        estado: 'ACTIVO',
        created_at: '2024-07-25',
        updated_at: null,
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error de validación o empresa ya existe' })
  registrar(@Body() dto: CrearEmpresaDto) {
    return this.empresasService.registrar(dto);
  }

  @Put('actualizar/:id')
  @ApiOperation({ summary: 'Actualizar una empresa existente' })
  @ApiBody({ type: ActualizarEmpresaDto })
  @ApiResponse({
    status: 200,
    description: 'Empresa actualizada correctamente',
    schema: {
      example: {
        id: 4,
        nombre: 'DemoCorp S.A.',
        cif: 'A12345678',
        abonado: true,
        razonSocial: 'DemoCorp Soluciones Integrales',
        domicilioFiscal: 'Calle Ficción 123, Zona Beta, Madrid',
        contacto1: 'Ana Duarte',
        tlf1: '600100100',
        email1: 'ana@democorp.test',
        facturacion: 'NINGUNA',
        observaciones: '',
        estado: 'ACTIVO',
        created_at: '2024-07-25',
        updated_at: '2024-07-26',
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  actualizar(@Param('id') id: number, @Body() dto: ActualizarEmpresaDto) {
    return this.empresasService.actualizar(id, dto);
  }

  @Get('get_lista')
  @ApiOperation({ summary: 'Obtener la lista de todas las empresas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de empresas',
    schema: {
      example: [
        {
          id: 4,
          nombre: 'DemoCorp S.A.',
          cif: 'A12345678',
          abonado: true,
          razonSocial: 'DemoCorp Soluciones Integrales',
          domicilioFiscal: 'Calle Ficción 123, Zona Beta, Madrid',
          contacto1: 'Ana Duarte',
          tlf1: '600100100',
          email1: 'ana@democorp.test',
          facturacion: 'NINGUNA',
          observaciones: '',
          estado: 'ACTIVO',
          created_at: '2024-07-25',
          updated_at: null,
          deleted_at: null
        }
      ]
    }
  })
  getLista() {
    return this.empresasService.getLista();
  }

  @Get('getByNombre')
  @ApiOperation({ summary: 'Buscar empresa por nombre' })
  @ApiResponse({
    status: 200,
    description: 'Empresa encontrada',
    schema: {
      example: {
        id: 4,
        nombre: 'DemoCorp S.A.',
        cif: 'A12345678',
        abonado: true,
        razonSocial: 'DemoCorp Soluciones Integrales',
        domicilioFiscal: 'Calle Ficción 123, Zona Beta, Madrid',
        contacto1: 'Ana Duarte',
        tlf1: '600100100',
        email1: 'ana@democorp.test',
        facturacion: 'NINGUNA',
        observaciones: '',
        estado: 'ACTIVO',
        created_at: '2024-07-25',
        updated_at: null,
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  getByNombre(@Query('nombre') nombre: string) {
    return this.empresasService.getByNombre(nombre);
  }
} 