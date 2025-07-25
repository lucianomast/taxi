import { Controller, Post, Body, Put, Param, Get, Query } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { CrearFacturaDto } from './dto/crear-factura.dto';
import { ActualizarFacturaDto } from './dto/actualizar-factura.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('facturacion')
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
} 