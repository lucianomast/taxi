import { Injectable, BadRequestException } from '@nestjs/common';
import { EnviarNotificacionDto } from './dto/enviar-notificacion.dto';

@Injectable()
export class NotificacionesService {
  async enviar(dto: any) {
    if (!dto || !dto.destinatario) {
      throw new BadRequestException('Falta el destinatario de la notificación');
    }
    // Aquí iría la lógica real de envío de notificaciones (push, email, etc.)
    // Por ahora, solo simula el envío
    return {
      success: true,
      message: `Notificación enviada a ${dto.destinatario}`,
    };
  }
} 