import { Controller, Post, Body, Put, Param, Get, Query, UseGuards, Res } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { CrearFacturaDto } from './dto/crear-factura.dto';
import { ActualizarFacturaDto } from './dto/actualizar-factura.dto';
import { FiltrarFacturaDto } from './dto/filtrar-factura.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@ApiTags('facturacion')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('facturacion')
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) {}

  @Post('crear')
  @ApiOperation({ summary: 'Crear una nueva factura' })
  @ApiBody({ type: CrearFacturaDto })
  @ApiResponse({
    status: 201,
    description: 'Factura creada correctamente',
    schema: {
      example: {
        id: 1,
        servicioId: 1100,
        importe: 120.5,
        fecha: '2024-07-25',
        clienteNombre: 'Ana Pérez',
        empresaNombre: 'DemoCorp S.A.',
        created_at: '2024-07-25',
        updated_at: null,
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error de validación o servicio inexistente' })
  crear(@Body() dto: CrearFacturaDto) {
    return this.facturacionService.crear(dto);
  }

  @Put('actualizar/:id')
  actualizar(@Param('id') id: number, @Body() dto: ActualizarFacturaDto) {
    return this.facturacionService.actualizar(id, dto);
  }

  @Get('get_lista')
  getLista() {
    return this.facturacionService.getLista();
  }

  @Get('getById')
  getById(@Query('id') id: number) {
    return this.facturacionService.getById(id);
  }

  @Post('filtrar-excel')
  @ApiOperation({ 
    summary: 'Filtrar facturas y enviar archivo Excel por email',
    description: `
    Genera un reporte de facturas basado en los filtros proporcionados y envía el archivo Excel por email.
    
    **Filtros disponibles:**
    - **fechaDesde**: Fecha de inicio (formato: YYYY-MM-DD)
    - **fechaHasta**: Fecha de fin (formato: YYYY-MM-DD)
    - **clienteid**: ID del cliente específico
    - **conductorid**: ID del conductor específico
    
    **Proceso:**
    1. Se aplican los filtros a la base de datos
    2. Se genera un archivo Excel con los resultados
    3. Se envía el archivo por email al destinatario especificado
    
    **Columnas del Excel:**
    - ID Factura, ID Servicio, Importe, Fecha
    - Cliente, Empresa, Origen, Destino
    - Conductor, Estado Servicio, Fechas de creación/actualización
    `
  })
  @ApiBody({ 
    type: FiltrarFacturaDto,
    description: 'Filtros de búsqueda y email de destino',
    examples: {
      'Filtro por fechas': {
        summary: 'Filtrar por rango de fechas',
        description: 'Obtener facturas entre dos fechas específicas',
        value: {
          filtros: {
            fechaDesde: "2022-05-01",
            fechaHasta: "2022-05-31"
          },
          usermail: "reportes@empresa.com"
        }
      },
      'Filtro por cliente': {
        summary: 'Filtrar por cliente específico',
        description: 'Obtener facturas de un cliente en particular',
        value: {
          filtros: {
            fechaDesde: "2022-05-01",
            fechaHasta: "2022-05-31",
            clienteid: 4
          },
          usermail: "contabilidad@empresa.com"
        }
      },
      'Filtro por conductor': {
        summary: 'Filtrar por conductor específico',
        description: 'Obtener facturas de un conductor en particular',
        value: {
          filtros: {
            fechaDesde: "2022-05-01",
            fechaHasta: "2022-05-31",
            conductorid: 1
          },
          usermail: "gerente@taxi.com"
        }
      },
      'Filtro completo': {
        summary: 'Filtro completo con cliente y conductor',
        description: 'Obtener facturas con todos los filtros aplicados',
        value: {
          filtros: {
            fechaDesde: "2022-05-01",
            fechaHasta: "2022-05-31",
            clienteid: 4,
            conductorid: 1
          },
          usermail: "admin@empresa.com"
        }
      },
      'Sin filtros': {
        summary: 'Todas las facturas',
        description: 'Obtener todas las facturas sin aplicar filtros',
        value: {
          filtros: {},
          usermail: "reportes@empresa.com"
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte enviado por email correctamente',
    schema: {
      example: {
        success: true,
        message: 'Reporte de facturas enviado exitosamente a admin@empresa.com. Se encontraron 15 facturas.'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Error en los filtros proporcionados',
    schema: {
      example: {
        message: ["property filtros should not exist"],
        error: "Bad Request",
        statusCode: 400
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido',
    schema: {
      example: {
        message: "Unauthorized",
        statusCode: 401
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor',
    schema: {
      example: {
        success: false,
        message: "Error al enviar el email con el reporte de facturas"
      }
    }
  })
  async filtrarYGenerarExcel(@Body() dto: FiltrarFacturaDto) {
    return await this.facturacionService.filtrarYGenerarExcel(dto);
  }
} 