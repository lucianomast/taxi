import { Controller, Post, Body, Put, Param, Get, Query, UseGuards } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CrearServicioDto } from './dto/crear-servicio.dto';
import { ActualizarServicioDto } from './dto/actualizar-servicio.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ESTADO_SERVICIO_VALORES } from './enums/estado-servicio.enum';

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
  @ApiOperation({ 
    summary: 'Obtener la lista de todos los servicios',
    description: 'Retorna todos los servicios con información del cliente asociado.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios con información del cliente',
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
          deleted_at: null,
          cliente: {
            id: 58,
            nombre: 'Ana',
            apellidos: 'Pérez Mora',
            telefono: '600000001',
            prefijo: '+34',
            email: 'ana@correo.com',
            direccionHabitual: 'C. Inventada, 123, 28000 Madrid, España',
            created_at: '2024-01-15T08:30:00.000Z',
            updated_at: null,
            deleted_at: null
          }
        }
      ]
    }
  })
  getLista() {
    return this.serviciosService.getLista();
  }

  @Get('get_lista_conductor')
  @ApiOperation({ 
    summary: 'Obtener la lista de servicios de un conductor',
    description: 'Retorna todos los servicios de un conductor específico con información completa del cliente y admin.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios del conductor con información completa',
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
          deleted_at: null,
          cliente: {
            id: 58,
            nombre: 'Ana',
            apellidos: 'Pérez Mora',
            telefono: '600000001',
            prefijo: '+34',
            email: 'ana@correo.com',
            direccionHabitual: 'C. Inventada, 123, 28000 Madrid, España'
          },
          conductor: {
            id: 2,
            nombre: 'Martín',
            apellidos: 'Domínguez',
            telefono: '664001824',
            matricula: '1377CVX',
            marcaCoche: 'Tesla',
            modeloCoche: 's3'
          },
          admin: {
            id: 22,
            nombre: 'Admin',
            apellidos: 'Sistema',
            email: 'admin@taxi.com'
          }
        }
      ]
    }
  })
  async getListaConductor(@Query('conductorId') conductorId: number) {
    return this.serviciosService.getListaConductor(conductorId);
  }

  @Get('getById')
  @ApiOperation({ 
    summary: 'Obtener un servicio por ID',
    description: 'Retorna un servicio específico con información completa del cliente, conductor y admin.'
  })
  @ApiResponse({
    status: 200,
    description: 'Servicio encontrado con información completa',
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
        deleted_at: null,
        cliente: {
          id: 58,
          nombre: 'Ana',
          apellidos: 'Pérez Mora',
          telefono: '600000001',
          prefijo: '+34',
          email: 'ana@correo.com',
          direccionHabitual: 'C. Inventada, 123, 28000 Madrid, España'
        },
        conductor: {
          id: 2,
          nombre: 'Martín',
          apellidos: 'Domínguez',
          telefono: '664001824',
          matricula: '1377CVX',
          marcaCoche: 'Tesla',
          modeloCoche: 's3'
        },
        admin: {
          id: 22,
          nombre: 'Admin',
          apellidos: 'Sistema',
          email: 'admin@taxi.com'
        }
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
    description: 'Tiempo estimado calculado correctamente con datos del conductor',
    schema: {
      example: {
        duracion: 300,
        duracionText: "5 mins",
        conductor: {
          id: 123,
          nombre: "Juan Pérez",
          apellidos: "García",
          matricula: "1234ABC",
          telefono: "123456789",
          email: "juan@email.com",
          estado: 10,
          posicion: {
            lat: "40.4168",
            lon: "-3.7038"
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'No hay conductores disponibles' })
  @ApiResponse({ status: 400, description: 'Error en el cálculo del tiempo estimado' })
  async getTiempoEstimado(@Query('inmediato') inmediato: boolean = false) {
    return this.serviciosService.getTiempoEstimado(inmediato);
  }

  @Get('estados')
  @ApiOperation({ 
    summary: 'Obtener estados disponibles de servicios',
    description: 'Retorna la lista de todos los estados posibles para un servicio con sus valores numéricos y descripciones.'
  })
  @ApiResponse({
    status: 200,
    description: 'Estados disponibles',
    schema: {
      example: [
        { valor: 7, descripcion: 'Reserva' },
        { valor: 10, descripcion: 'Asignado' },
        { valor: 15, descripcion: 'Confirmado' },
        { valor: 20, descripcion: 'En ruta' },
        { valor: 25, descripcion: 'En puerta' },
        { valor: 30, descripcion: 'Con cliente' },
        { valor: 40, descripcion: 'Finalizado' },
        { valor: 90, descripcion: 'Cancelado' }
      ]
    }
  })
  getEstados() {
    return ESTADO_SERVICIO_VALORES;
  }

  @Get('get_reservas')
  @ApiOperation({ 
    summary: 'Obtener servicios con estado Reserva',
    description: `
    Retorna todos los servicios que tienen estado 7 (Reserva). 
    
    **Características del endpoint:**
    - Filtra automáticamente servicios con estado = 7 (Reserva)
    - Incluye relaciones completas: cliente, conductor y admin
    - Ordena por fecha de creación (más recientes primero)
    - Útil para mostrar servicios pendientes de asignación
    
    **Estados de servicio:**
    - 7: Reserva (servicios pendientes de asignar conductor)
    - 10: Asignado
    - 15: Confirmado
    - 20: En ruta
    - 25: En puerta
    - 30: Con cliente
    - 40: Finalizado
    - 90: Cancelado
    
    **Uso típico:**
    - Panel de administración para ver servicios pendientes
    - Asignación manual de conductores
    - Gestión de reservas
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios en reserva obtenida correctamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1100, description: 'ID único del servicio' },
          clienteId: { type: 'number', example: 58, description: 'ID del cliente' },
          conductorId: { type: 'number', example: null, description: 'ID del conductor (null si no está asignado)' },
          origen: { type: 'string', example: 'Santa Teresa 2227, Morón', description: 'Dirección de origen' },
          destino: { type: 'string', example: 'rafael castillo', description: 'Dirección de destino' },
          origenLat: { type: 'string', example: '40.345247', description: 'Latitud del origen' },
          origenLon: { type: 'string', example: '-3.819113', description: 'Longitud del origen' },
          destinoLat: { type: 'string', example: '40.403342', description: 'Latitud del destino' },
          destinoLon: { type: 'string', example: '-3.738408', description: 'Longitud del destino' },
          estado: { type: 'number', example: 7, description: 'Estado del servicio (7 = Reserva)' },
          adminId: { type: 'number', example: 1, description: 'ID del administrador que creó el servicio' },
          inmediato: { type: 'boolean', example: false, description: 'Si es servicio inmediato' },
          observaciones: { type: 'string', example: 'Cliente VIP', description: 'Observaciones del servicio' },
          comentarioServicio: { type: 'string', example: '', description: 'Comentario del servicio' },
          formaPago: { type: 'string', example: 'Efectivo', description: 'Forma de pago' },
          precio: { type: 'number', example: 22.43, description: 'Precio del servicio' },
          created_at: { type: 'string', example: '2024-07-25T12:00:00.000Z', description: 'Fecha de creación' },
          updated_at: { type: 'string', example: null, description: 'Fecha de última actualización' },
          deleted_at: { type: 'string', example: null, description: 'Fecha de eliminación (soft delete)' },
          cliente: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 58, description: 'ID del cliente' },
              nombre: { type: 'string', example: 'Ana', description: 'Nombre del cliente' },
              apellidos: { type: 'string', example: 'Pérez', description: 'Apellidos del cliente' },
              email: { type: 'string', example: 'ana.perez@email.com', description: 'Email del cliente' }
            }
          },
          conductor: {
            type: 'object',
            nullable: true,
            description: 'Información del conductor (null si no está asignado)'
          },
          admin: {
            type: 'object',
            description: 'Información del administrador que creó el servicio'
          }
        }
      },
      example: [
        {
          id: 1100,
          clienteId: 58,
          conductorId: null,
          origen: 'Santa Teresa 2227, Morón',
          destino: 'rafael castillo',
          origenLat: '40.345247',
          origenLon: '-3.819113',
          destinoLat: '40.403342',
          destinoLon: '-3.738408',
          estado: 7,
          adminId: 1,
          inmediato: false,
          observaciones: 'Cliente VIP',
          comentarioServicio: '',
          formaPago: 'Efectivo',
          precio: 22.43,
          created_at: '2024-07-25T12:00:00.000Z',
          updated_at: null,
          deleted_at: null,
          cliente: {
            id: 58,
            nombre: 'Ana',
            apellidos: 'Pérez',
            email: 'ana.perez@email.com'
          },
          conductor: null,
          admin: {
            id: 1,
            nombre: 'Admin',
            apellidos: 'Sistema'
          }
        },
        {
          id: 1101,
          clienteId: 59,
          conductorId: null,
          origen: 'Av. Corrientes 1234, Buenos Aires',
          destino: 'Plaza de Mayo, Buenos Aires',
          origenLat: '-34.6037',
          origenLon: '-58.3816',
          destinoLat: '-34.6084',
          destinoLon: '-58.3731',
          estado: 7,
          adminId: 1,
          inmediato: true,
          observaciones: 'Servicio urgente',
          comentarioServicio: 'Cliente solicita prioridad',
          formaPago: 'Tarjeta',
          precio: 35.50,
          created_at: '2024-07-25T13:30:00.000Z',
          updated_at: null,
          deleted_at: null,
          cliente: {
            id: 59,
            nombre: 'Carlos',
            apellidos: 'González',
            email: 'carlos.gonzalez@email.com'
          },
          conductor: null,
          admin: {
            id: 1,
            nombre: 'Admin',
            apellidos: 'Sistema'
          }
        }
      ]
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
    status: 404, 
    description: 'No se encontraron servicios en reserva',
    schema: {
      example: {
        message: 'No se encontraron servicios en estado de reserva',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor',
    schema: {
      example: {
        message: 'Error al obtener los servicios en reserva',
        error: 'Internal Server Error',
        statusCode: 500
      }
    }
  })
  getReservas() {
    return this.serviciosService.getReservas();
  }

  @Get('get_asignados_pendientes')
  @ApiOperation({ 
    summary: 'Obtener servicios asignados pendientes de confirmación',
    description: `
    Retorna todos los servicios que están en estado 10 (Asignado) y pendientes de confirmación del conductor.
    
    **Características del endpoint:**
    - Filtra servicios con estado = 10 (Asignado)
    - Solo servicios que tienen conductor asignado
    - Pendientes de confirmación del conductor
    - No rechazados ni cancelados
    - No finalizados
    - Incluye relaciones completas: cliente, conductor y admin
    - Ordena por fecha de creación (más recientes primero)
    
    **Estados de servicio:**
    - 7: Reserva (servicios pendientes de asignar conductor)
    - 10: Asignado (servicios asignados, pendientes de confirmación)
    - 15: Confirmado
    - 20: En ruta
    - 25: En puerta
    - 30: Con cliente
    - 40: Finalizado
    - 90: Cancelado
    
    **Uso típico:**
    - Panel de administración para ver servicios asignados
    - Seguimiento de confirmaciones pendientes
    - Gestión de servicios en proceso de asignación
    - Notificaciones a conductores para confirmar servicios
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios asignados pendientes de confirmación',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1100, description: 'ID único del servicio' },
          clienteId: { type: 'number', example: 58, description: 'ID del cliente' },
          conductorId: { type: 'number', example: 3, description: 'ID del conductor asignado' },
          origen: { type: 'string', example: 'Santa Teresa 2227, Morón', description: 'Dirección de origen' },
          destino: { type: 'string', example: 'rafael castillo', description: 'Dirección de destino' },
          origenLat: { type: 'string', example: '40.345247', description: 'Latitud del origen' },
          origenLon: { type: 'string', example: '-3.819113', description: 'Longitud del origen' },
          destinoLat: { type: 'string', example: '40.403342', description: 'Latitud del destino' },
          destinoLon: { type: 'string', example: '-3.738408', description: 'Longitud del destino' },
          estado: { type: 'number', example: 10, description: 'Estado del servicio (10 = Asignado)' },
          adminId: { type: 'number', example: 1, description: 'ID del administrador que creó el servicio' },
          inmediato: { type: 'boolean', example: false, description: 'Si es servicio inmediato' },
          observaciones: { type: 'string', example: 'Cliente VIP', description: 'Observaciones del servicio' },
          comentarioServicio: { type: 'string', example: '', description: 'Comentario del servicio' },
          formaPago: { type: 'string', example: 'Efectivo', description: 'Forma de pago' },
          precio: { type: 'number', example: 22.43, description: 'Precio del servicio' },
          created_at: { type: 'string', example: '2024-07-25T12:00:00.000Z', description: 'Fecha de creación' },
          updated_at: { type: 'string', example: null, description: 'Fecha de última actualización' },
          deleted_at: { type: 'string', example: null, description: 'Fecha de eliminación (soft delete)' },
          cliente: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 58, description: 'ID del cliente' },
              nombre: { type: 'string', example: 'Ana', description: 'Nombre del cliente' },
              apellidos: { type: 'string', example: 'Pérez', description: 'Apellidos del cliente' },
              email: { type: 'string', example: 'ana.perez@email.com', description: 'Email del cliente' }
            }
          },
          conductor: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 3, description: 'ID del conductor' },
              nombre: { type: 'string', example: 'Juan', description: 'Nombre del conductor' },
              apellidos: { type: 'string', example: 'García', description: 'Apellidos del conductor' },
              matricula: { type: 'string', example: 'ABC123', description: 'Matrícula del vehículo' },
              telefono: { type: 'string', example: '+34612345678', description: 'Teléfono del conductor' }
            }
          },
          admin: {
            type: 'object',
            description: 'Información del administrador que creó el servicio'
          }
        }
      },
      example: [
        {
          id: 1100,
          clienteId: 58,
          conductorId: 3,
          origen: 'Santa Teresa 2227, Morón',
          destino: 'rafael castillo',
          origenLat: '40.345247',
          origenLon: '-3.819113',
          destinoLat: '40.403342',
          destinoLon: '-3.738408',
          estado: 10,
          adminId: 1,
          inmediato: false,
          observaciones: 'Cliente VIP',
          comentarioServicio: '',
          formaPago: 'Efectivo',
          precio: 22.43,
          created_at: '2024-07-25T12:00:00.000Z',
          updated_at: null,
          deleted_at: null,
          cliente: {
            id: 58,
            nombre: 'Ana',
            apellidos: 'Pérez',
            email: 'ana.perez@email.com'
          },
          conductor: {
            id: 3,
            nombre: 'Juan',
            apellidos: 'García',
            matricula: 'ABC123',
            telefono: '+34612345678'
          },
          admin: {
            id: 1,
            nombre: 'Admin',
            apellidos: 'Sistema'
          }
        },
        {
          id: 1101,
          clienteId: 59,
          conductorId: 4,
          origen: 'Av. Corrientes 1234, Buenos Aires',
          destino: 'Plaza de Mayo, Buenos Aires',
          origenLat: '-34.6037',
          origenLon: '-58.3816',
          destinoLat: '-34.6084',
          destinoLon: '-58.3731',
          estado: 10,
          adminId: 1,
          inmediato: true,
          observaciones: 'Servicio urgente',
          comentarioServicio: 'Cliente solicita prioridad',
          formaPago: 'Tarjeta',
          precio: 35.50,
          created_at: '2024-07-25T13:30:00.000Z',
          updated_at: null,
          deleted_at: null,
          cliente: {
            id: 59,
            nombre: 'Carlos',
            apellidos: 'González',
            email: 'carlos.gonzalez@email.com'
          },
          conductor: {
            id: 4,
            nombre: 'María',
            apellidos: 'López',
            matricula: 'XYZ789',
            telefono: '+34687654321'
          },
          admin: {
            id: 1,
            nombre: 'Admin',
            apellidos: 'Sistema'
          }
        }
      ]
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
    status: 404, 
    description: 'No se encontraron servicios asignados pendientes',
    schema: {
      example: {
        message: 'No se encontraron servicios asignados pendientes de confirmación',
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor',
    schema: {
      example: {
        message: 'Error al obtener los servicios asignados pendientes',
        error: 'Internal Server Error',
        statusCode: 500
      }
    }
  })
  getAsignadosPendientes() {
    return this.serviciosService.getAsignadosPendientes();
  }

  @Post('calcular-precio')
  @ApiOperation({ 
    summary: 'Calcular precio de un servicio',
    description: `
    Calcula el precio de un servicio usando las coordenadas proporcionadas sin crear el servicio.
    
    **Características:**
    - Usa las coordenadas de origen y destino proporcionadas
    - Calcula precio basado en distancia y tarifas vigentes
    - No crea el servicio, solo devuelve el precio calculado
    - Útil para mostrar precio antes de confirmar el servicio
    
    **Parámetros requeridos:**
    - origen: Dirección de origen
    - destino: Dirección de destino  
    - origenLat, origenLon: Coordenadas del origen
    - destinoLat, destinoLon: Coordenadas del destino
    `
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        origen: { type: 'string', example: 'Santa Teresa 2227, Morón', description: 'Dirección de origen' },
        destino: { type: 'string', example: 'rafael castillo', description: 'Dirección de destino' },
        origenLat: { type: 'string', example: '40.345247', description: 'Latitud del origen' },
        origenLon: { type: 'string', example: '-3.819113', description: 'Longitud del origen' },
        destinoLat: { type: 'string', example: '40.403342', description: 'Latitud del destino' },
        destinoLon: { type: 'string', example: '-3.738408', description: 'Longitud del destino' },
        fecha: { type: 'string', example: '2024-07-25', description: 'Fecha del servicio (opcional, usa fecha actual si no se proporciona)' },
        hora: { type: 'string', example: '14:30', description: 'Hora del servicio (opcional, usa hora actual si no se proporciona)' },
        tipo_servicio: { type: 'string', example: 'normal', description: 'Tipo de servicio (normal, vip, etc.)' },
        zona: { type: 'string', example: 'general', description: 'Zona de tarifa' }
      },
      required: ['origen', 'destino', 'origenLat', 'origenLon', 'destinoLat', 'destinoLon']
    },
    examples: {
      'Ejemplo básico': {
        summary: 'Cálculo básico de precio',
        value: {
          origen: 'Santa Teresa 2227, Morón',
          destino: 'rafael castillo',
          origenLat: '40.345247',
          origenLon: '-3.819113',
          destinoLat: '40.403342',
          destinoLon: '-3.738408'
        }
      },
      'Ejemplo completo': {
        summary: 'Cálculo con todos los parámetros',
        value: {
          origen: 'Av. Corrientes 1234, Buenos Aires',
          destino: 'Plaza de Mayo, Buenos Aires',
          origenLat: '-34.6037',
          origenLon: '-58.3816',
          destinoLat: '-34.6084',
          destinoLon: '-58.3731',
          fecha: '2024-07-25',
          hora: '14:30',
          tipo_servicio: 'normal',
          zona: 'general'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Precio calculado correctamente',
    schema: {
      example: {
        precio: 22.43,
        distancia: 5.2,
        tiempoEstimado: 15,
        origen: 'Santa Teresa 2227, Morón',
        destino: 'rafael castillo',
        detalles: {
          tarifaBase: 10.00,
          tarifaPorKm: 2.50,
          recargos: 0.00
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Error en los parámetros o cálculo del precio',
    schema: {
      example: {
        message: 'Error al calcular el precio del servicio',
        error: 'Bad Request',
        statusCode: 400
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor',
    schema: {
      example: {
        message: 'Error interno al calcular el precio',
        error: 'Internal Server Error',
        statusCode: 500
      }
    }
  })
  calcularPrecio(@Body() dto: any) {
    return this.serviciosService.calcularPrecioServicio(dto);
  }

  @Post('servicios-huerfanos')
  @ApiOperation({ 
    summary: 'Procesar servicios huérfanos automáticamente',
    description: `
    Procesa servicios huérfanos (sin conductor asignado por más de 45 minutos) y los asigna al conductor más cercano automáticamente.
    
    **Características del endpoint:**
    - Busca servicios en estado Reserva (7) sin conductor asignado
    - Filtra servicios creados hace más de 45 minutos
    - Asigna automáticamente al conductor más cercano
    - Cambia el estado del servicio a Asignado (10)
    - Envía notificación push al conductor asignado
    - Procesa los servicios más antiguos primero
    
    **Uso típico:**
    - Ejecución automática cada 45 minutos (cron job)
    - Gestión automática de servicios abandonados
    - Mejora de la experiencia del cliente
    - Optimización de asignación de conductores
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Procesamiento de servicios huérfanos completado',
    schema: {
      example: {
        success: true,
        message: "Procesamiento de servicios huérfanos completado",
        serviciosProcesados: 3,
        serviciosAsignados: 2,
        serviciosFallidos: 1,
        resultados: [
          {
            servicioId: 1100,
            conductorId: 2,
            conductorNombre: "Juan Pérez",
            tiempoEstimado: "5 mins",
            estado: "asignado"
          },
          {
            servicioId: 1101,
            conductorId: 3,
            conductorNombre: "María García",
            tiempoEstimado: "8 mins",
            estado: "asignado"
          },
          {
            servicioId: 1102,
            estado: "fallido",
            motivo: "No se encontró conductor disponible"
          }
        ],
        fechaProcesamiento: "2024-07-25T14:30:00.000Z"
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
        message: 'Error al procesar servicios huérfanos',
        error: 'Internal Server Error',
        statusCode: 500
      }
    }
  })
  procesarServiciosHuerfanos() {
    return this.serviciosService.procesarServiciosHuerfanos();
  }
} 