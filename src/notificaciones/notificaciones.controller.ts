import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { EnviarNotificacionDto } from './dto/enviar-notificacion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('notificaciones')
@Controller('notificaciones')
@UseGuards(JwtAuthGuard) // Proteger todo el controlador
@ApiBearerAuth('JWT-auth') // Agregar autenticación Bearer en Swagger
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post('enviar')
  @ApiOperation({ summary: 'Enviar una notificación a un usuario' })
  @ApiBody({ type: EnviarNotificacionDto })
  @ApiResponse({
    status: 201,
    description: 'Notificación enviada correctamente',
    schema: {
      example: {
        success: true,
        message: 'Notificación enviada a 600000001'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error de validación o destinatario inválido' })
  enviar(@Body() dto: EnviarNotificacionDto) {
    return this.notificacionesService.enviar(dto);
  }

  @Post('servicio-asignado')
  @ApiOperation({ 
    summary: 'Enviar notificación de servicio asignado al conductor',
    description: 'Envía una notificación push al conductor cuando se le asigna un nuevo servicio. Se ejecuta automáticamente al crear servicios con conductorId.'
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        conductorId: { type: 'number', example: 1, description: 'ID del conductor' },
        servicioId: { type: 'number', example: 123, description: 'ID del servicio asignado' },
        datosServicio: { 
          type: 'object',
          properties: {
            origen: { type: 'string', example: 'Calle Mayor 123, Madrid' },
            destino: { type: 'string', example: 'Plaza España 1, Madrid' },
            precio: { type: 'number', example: 25.50 },
            fecha: { type: 'string', example: '2024-01-15T12:00:00.000Z' }
          }
        }
      },
      required: ['conductorId', 'servicioId', 'datosServicio']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Notificación de servicio asignado enviada correctamente',
    schema: {
      example: {
        success: true,
        message: 'Notificación enviada al conductor 1 sobre servicio 123'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  enviarNotificacionServicioAsignado(@Body() body: { 
    conductorId: number; 
    servicioId: number; 
    datosServicio: any; 
  }) {
    return this.notificacionesService.enviarNotificacionServicioAsignado(
      body.conductorId,
      body.servicioId,
      body.datosServicio
    );
  }
} 