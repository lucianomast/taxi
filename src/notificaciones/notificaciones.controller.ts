import { Controller, Post, Body } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { EnviarNotificacionDto } from './dto/enviar-notificacion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('notificaciones')
@Controller('notificaciones')
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
} 