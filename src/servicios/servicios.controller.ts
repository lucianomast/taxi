import { Controller, Post, Body, Put, Param, Get, Query, UseGuards } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CrearServicioDto } from './dto/crear-servicio.dto';
import { ActualizarServicioDto } from './dto/actualizar-servicio.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('servicios')
@Controller('servicios')
@UseGuards(JwtAuthGuard) // Proteger todo el controlador
@ApiBearerAuth('JWT-auth') // Agregar autenticación Bearer en Swagger
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post('crear')
  @ApiOperation({ 
    summary: 'Crear un nuevo servicio',
    description: 'Crea un servicio usando las coordenadas proporcionadas por el frontend. Las coordenadas de latitud y longitud tanto del origen como del destino son requeridas y deben ser proporcionadas por el frontend.'
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        clienteId: { type: 'number', example: 58, description: 'ID del cliente' },
        origen: { type: 'string', example: 'Santa Teresa 2227, Morón', description: 'Dirección de origen' },
        destino: { type: 'string', example: 'rafael castillo', description: 'Dirección de destino' },
        origenLat: { type: 'string', example: '40.345247', description: 'Latitud del origen (proporcionada por el frontend)' },
        origenLon: { type: 'string', example: '-3.819113', description: 'Longitud del origen (proporcionada por el frontend)' },
        destinoLat: { type: 'string', example: '40.403342', description: 'Latitud del destino (proporcionada por el frontend)' },
        destinoLon: { type: 'string', example: '-3.738408', description: 'Longitud del destino (proporcionada por el frontend)' },
        estado: { type: 'number', example: 10, description: 'Estado del servicio' },
        adminId: { type: 'number', example: 1, description: 'ID del admin' },
        inmediato: { type: 'boolean', example: true, description: 'Asignar conductor automáticamente' },
        observaciones: { type: 'string', example: 'Cliente VIP', description: 'Observaciones del servicio' },
        comentarioServicio: { type: 'string', example: '', description: 'Comentario del servicio' },
        formaPago: { type: 'string', example: 'Efectivo', description: 'Forma de pago' }
      },
      required: ['clienteId', 'origen', 'destino', 'origenLat', 'origenLon', 'destinoLat', 'destinoLon', 'estado', 'adminId']
    },
    examples: {
      'Ejemplo con coordenadas': {
        summary: 'Crear servicio con coordenadas del frontend',
        value: {
          clienteId: 58,
          origen: 'Santa Teresa 2227, Morón',
          destino: 'rafael castillo',
          origenLat: '40.345247',
          origenLon: '-3.819113',
          destinoLat: '40.403342',
          destinoLon: '-3.738408',
          estado: 10,
          adminId: 1,
          inmediato: true,
          observaciones: 'Cliente VIP',
          comentarioServicio: '',
          formaPago: 'Efectivo'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Servicio creado correctamente',
    schema: {
      example: {
        id: 1100,
        clienteId: 58,
        conductorId: 2,
        origen: 'Santa Teresa 2227, Morón',
        destino: 'rafael castillo',
        origenLat: '40.345247',
        origenLon: '-3.819113',
        destinoLat: '40.403342',
        destinoLon: '-3.738408',
        estado: 10,
        adminId: 1,
        inmediato: true,
        observaciones: 'Cliente VIP',
        comentarioServicio: '',
        formaPago: 'Efectivo',
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

  @Get('get_tiempo_estimado')
  @ApiOperation({ 
    summary: 'Obtener tiempo estimado de llegada del conductor más cercano',
    description: 'Verifica la disponibilidad de conductores según criterios específicos (activo, disponible, no penalizado, con posición) y calcula el tiempo estimado de llegada del conductor más cercano al origen del servicio.'
  })
  @ApiResponse({
    status: 200,
    description: 'Tiempo estimado calculado correctamente',
    schema: {
      example: {
        duracion: 300,
        duracionText: "5 mins",
        conductor: {
          id: 2,
          nombre: "Juan",
          apellidos: "Pérez",
          matricula: "ABC123"
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'No hay conductores disponibles' })
  @ApiResponse({ status: 400, description: 'Error en el cálculo del tiempo estimado' })
  async getTiempoEstimado(@Query('inmediato') inmediato: boolean = false) {
    return this.serviciosService.getTiempoEstimado(inmediato);
  }
} 