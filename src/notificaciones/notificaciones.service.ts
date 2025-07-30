import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { EnviarNotificacionDto } from './dto/enviar-notificacion.dto';

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);

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

  async enviarNotificacionServicioAsignado(conductorId: number, servicioId: number, datosServicio: any) {
    try {
      this.logger.log(`📱 Enviando notificación push al conductor ${conductorId} sobre servicio ${servicioId}`);
      
      // Aquí iría la lógica real de envío de push notification
      // Por ahora, simulamos el envío
      const notificacion = {
        destinatario: conductorId.toString(),
        mensaje: `¡Nuevo servicio asignado! ID: ${servicioId}`,
        titulo: 'Servicio Asignado',
        datos: {
          tipo: 'servicio_asignado',
          servicioId: servicioId,
          origen: datosServicio.origen,
          destino: datosServicio.destino,
          precio: datosServicio.precio,
          conductorId: conductorId
        }
      };

      this.logger.log(`📋 Notificación preparada:`, notificacion);
      
      // Simular envío de push notification
      const resultado = await this.enviar(notificacion);
      
      this.logger.log(`✅ Notificación push enviada exitosamente al conductor ${conductorId}`);
      return resultado;
    } catch (error) {
      this.logger.error(`❌ Error enviando notificación push al conductor ${conductorId}:`, error);
      return {
        success: false,
        message: `Error enviando notificación: ${error.message}`
      };
    }
  }
} 