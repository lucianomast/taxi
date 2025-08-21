import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ServiciosService } from './servicios.service';

@Injectable()
export class ServiciosCronService {
  private readonly logger = new Logger(ServiciosCronService.name);

  constructor(private readonly serviciosService: ServiciosService) {}

  /**
   * Tarea programada que se ejecuta cada 45 minutos
   * Procesa servicios huérfanos automáticamente
   */
  @Cron('0 */45 * * * *') // Cada 45 minutos
  async procesarServiciosHuerfanosAutomatico() {
    this.logger.log('🕐 Ejecutando tarea programada: Procesamiento de servicios huérfanos');
    
    try {
      const resultado = await this.serviciosService.procesarServiciosHuerfanos();
      
      this.logger.log(`✅ Tarea programada completada: ${resultado.serviciosAsignados} servicios asignados, ${resultado.serviciosFallidos} fallidos`);
      
      // Log detallado de resultados
      if (resultado.serviciosProcesados > 0) {
        this.logger.log(`📊 Resumen: ${resultado.serviciosProcesados} servicios procesados`);
        
        resultado.resultados.forEach((resultado: any) => {
          if (resultado.estado === 'asignado') {
            this.logger.log(`✅ Servicio ${resultado.servicioId} asignado a ${resultado.conductorNombre} (${resultado.tiempoEstimado})`);
          } else {
            this.logger.warn(`⚠️ Servicio ${resultado.servicioId} falló: ${resultado.motivo}`);
          }
        });
      }
    } catch (error) {
      this.logger.error('❌ Error en tarea programada de servicios huérfanos:', error);
    }
  }

  /**
   * Tarea programada que se ejecuta cada hora para monitoreo
   * Verifica el estado de los servicios huérfanos
   */
  @Cron(CronExpression.EVERY_HOUR)
  async monitorearServiciosHuerfanos() {
    this.logger.log('🔍 Monitoreo de servicios huérfanos - Verificando estado del sistema');
    
    try {
      // Aquí podrías agregar lógica adicional de monitoreo
      // Por ejemplo, contar servicios huérfanos, enviar alertas, etc.
      this.logger.log('📈 Monitoreo de servicios huérfanos completado');
    } catch (error) {
      this.logger.error('❌ Error en monitoreo de servicios huérfanos:', error);
    }
  }
}
