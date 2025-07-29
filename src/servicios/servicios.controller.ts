import { Controller, Post, Body, Put, Param, Get, Query, UseGuards } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CrearServicioDto } from './dto/crear-servicio.dto';
import { ActualizarServicioDto } from './dto/actualizar-servicio.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('servicios')
@Controller('servicios')
@UseGuards(JwtAuthGuard) // Proteger todo el controlador
@ApiBearerAuth() // Agregar autenticación Bearer en Swagger
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post('crear')
  @ApiOperation({ summary: 'Crear un nuevo servicio' })
  @ApiBody({ type: CrearServicioDto })
  @ApiResponse({
    status: 201,
    description: 'Servicio creado correctamente',
    schema: {
      example: {
        id: 1100,
        clienteId: 58,
        conductorId: 2,
        origen: 'Origen ficticio #8',
        destino: 'Destino ficticio #193',
        origenLat: '40.345247',
        origenLon: '-3.819113',
        destinoLat: '40.403342',
        destinoLon: '-3.738408',
        estado: 40,
        adminId: 22,
        inmediato: false,
        observaciones: null,
        comentarioServicio: 'servicio simulado para pruebas',
        formaPago: 'T',
        precio: 22.43,
        created_at: '2024-07-25T12:00:00.000Z',
        updated_at: null,
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error de validación o datos incorrectos' })
  crear(@Body() dto: CrearServicioDto) {
    return this.serviciosService.crear(dto);
  }

  @Put('actualizar/:id')
  @ApiOperation({ summary: 'Actualizar un servicio existente' })
  @ApiBody({ type: ActualizarServicioDto })
  @ApiResponse({
    status: 200,
    description: 'Servicio actualizado correctamente',
    schema: {
      example: {
        id: 1100,
        clienteId: 58,
        conductorId: 2,
        origen: 'Origen ficticio #8',
        destino: 'Destino ficticio #193',
        origenLat: '40.345247',
        origenLon: '-3.819113',
        destinoLat: '40.403342',
        destinoLon: '-3.738408',
        estado: 40,
        adminId: 22,
        inmediato: false,
        observaciones: null,
        comentarioServicio: 'servicio simulado para pruebas',
        formaPago: 'T',
        precio: 22.43,
        created_at: '2024-07-25T12:00:00.000Z',
        updated_at: '2024-07-26T12:00:00.000Z',
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  actualizar(@Param('id') id: number, @Body() dto: ActualizarServicioDto) {
    return this.serviciosService.actualizar(id, dto);
  }

  @Get('get_lista')
  @ApiOperation({ summary: 'Obtener la lista de todos los servicios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios',
    schema: {
      example: [
        {
          id: 1100,
          clienteId: 58,
          conductorId: 2,
          origen: 'Origen ficticio #8',
          destino: 'Destino ficticio #193',
          origenLat: '40.345247',
          origenLon: '-3.819113',
          destinoLat: '40.403342',
          destinoLon: '-3.738408',
          estado: 40,
          adminId: 22,
          inmediato: false,
          observaciones: null,
          comentarioServicio: 'servicio simulado para pruebas',
          formaPago: 'T',
          precio: 22.43,
          created_at: '2024-07-25T12:00:00.000Z',
          updated_at: null,
          deleted_at: null
        }
      ]
    }
  })
  getLista() {
    return this.serviciosService.getLista();
  }

  @Get('get_lista_conductor')
  @ApiOperation({ summary: 'Obtener la lista de servicios de un conductor' })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios del conductor',
    schema: {
      example: [
        {
          id: 1100,
          clienteId: 58,
          conductorId: 2,
          origen: 'Origen ficticio #8',
          destino: 'Destino ficticio #193',
          origenLat: '40.345247',
          origenLon: '-3.819113',
          destinoLat: '40.403342',
          destinoLon: '-3.738408',
          estado: 40,
          adminId: 22,
          inmediato: false,
          observaciones: null,
          comentarioServicio: 'servicio simulado para pruebas',
          formaPago: 'T',
          precio: 22.43,
          created_at: '2024-07-25T12:00:00.000Z',
          updated_at: null,
          deleted_at: null
        }
      ]
    }
  })
  async getListaConductor(@Query('conductorId') conductorId: number) {
    return this.serviciosService.getListaConductor(conductorId);
  }

  @Get('getById')
  @ApiOperation({ summary: 'Obtener un servicio por ID' })
  @ApiResponse({
    status: 200,
    description: 'Servicio encontrado',
    schema: {
      example: {
        id: 1100,
        clienteId: 58,
        conductorId: 2,
        origen: 'Origen ficticio #8',
        destino: 'Destino ficticio #193',
        origenLat: '40.345247',
        origenLon: '-3.819113',
        destinoLat: '40.403342',
        destinoLon: '-3.738408',
        estado: 40,
        adminId: 22,
        inmediato: false,
        observaciones: null,
        comentarioServicio: 'servicio simulado para pruebas',
        formaPago: 'T',
        precio: 22.43,
        created_at: '2024-07-25T12:00:00.000Z',
        updated_at: null,
        deleted_at: null
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  getById(@Query('id') id: number) {
    return this.serviciosService.getById(id);
  }
} 