import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    // Usar variable de entorno o fallback a la key hardcodeada
    const apiKey = process.env.RESEND_API_KEY || 're_GdNFSwpN_2G9GvdamwSHjiSQVE5GR1m58';
    this.resend = new Resend(apiKey);
    
    this.logger.log(`📧 EmailService inicializado`);
    this.logger.log(`🔑 API Key configurada: ${apiKey ? 'Sí' : 'No'}`);
  }

  async enviarCodigoActivacion(email: string, codigo: string, nombre: string): Promise<boolean> {
    try {
      this.logger.log(`📧 Intentando enviar código de activación a: ${email}`);
      
      const result = await this.resend.emails.send({
        from: 'onboarding@resend.dev', // Usar dominio verificado de Resend
        to: email,
        subject: 'Código de Activación - Taxi App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">¡Hola ${nombre}!</h2>
            <p>Has solicitado activar tu cuenta de conductor en Taxi App.</p>
            <p>Tu código de activación es:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #007bff; font-size: 32px; margin: 0;">${codigo}</h1>
            </div>
            <p><strong>Este código expira en 15 minutos.</strong></p>
            <p>Si no solicitaste este código, puedes ignorar este email.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Este es un email automático, no respondas a este mensaje.
            </p>
          </div>
        `,
      });
      
      this.logger.log(`✅ Email enviado exitosamente a: ${email}`);
      this.logger.log(`📋 ID del email: ${result.data?.id || 'N/A'}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Error enviando email a ${email}:`, error);
      this.logger.error(`🔍 Detalles del error:`, {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode
      });
      return false;
    }
  }

  async enviarConfirmacionActivacion(email: string, nombre: string): Promise<boolean> {
    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Cuenta Activada - Taxi App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">¡Cuenta Activada Exitosamente!</h2>
            <p>Hola ${nombre},</p>
            <p>Tu cuenta de conductor ha sido activada correctamente.</p>
            <p>Ya puedes iniciar sesión en la aplicación y comenzar a recibir solicitudes de viajes.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Gracias por usar Taxi App.
            </p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('Error enviando email de confirmación:', error);
      return false;
    }
  }

  async enviarCodigoRecuperacion(email: string, codigo: string, nombre: string): Promise<boolean> {
    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Recuperación de Contraseña - Taxi App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">¡Hola ${nombre}!</h2>
            <p>Has solicitado recuperar tu contraseña en Taxi App.</p>
            <p>Tu código de recuperación es:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #dc3545; font-size: 32px; margin: 0;">${codigo}</h1>
            </div>
            <p><strong>Este código expira en 15 minutos.</strong></p>
            <p>Si no solicitaste este código, puedes ignorar este email.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Este es un email automático, no respondas a este mensaje.
            </p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('Error enviando email de recuperación:', error);
      return false;
    }
  }

  async enviarConfirmacionCambioPassword(email: string, nombre: string): Promise<boolean> {
    try {
      this.logger.log(`📧 Enviando confirmación de cambio de password a: ${email}`);
      
      const result = await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Contraseña Cambiada - Taxi App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">¡Contraseña Cambiada Exitosamente!</h2>
            <p>Hola ${nombre},</p>
            <p>Tu contraseña ha sido cambiada correctamente.</p>
            <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Si no realizaste este cambio, contacta inmediatamente con soporte.
            </p>
          </div>
        `,
      });
      
      this.logger.log(`✅ Email de confirmación enviado a: ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Error enviando email de confirmación a ${email}:`, error);
      return false;
    }
  }

  async enviarFacturasExcel(email: string, buffer: Buffer, filename: string, filtros: any): Promise<boolean> {
    try {
      this.logger.log(`📧 Enviando reporte de facturas a: ${email}`);
      
      const result = await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reporte de Facturas - Taxi App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reporte de Facturas</h2>
            <p>Hola,</p>
            <p>Se ha generado el reporte de facturas según los filtros solicitados:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Filtros aplicados:</strong></p>
              <ul>
                ${filtros.fechaDesde ? `<li>Fecha desde: ${filtros.fechaDesde}</li>` : ''}
                ${filtros.fechaHasta ? `<li>Fecha hasta: ${filtros.fechaHasta}</li>` : ''}
                ${filtros.clienteid ? `<li>Cliente ID: ${filtros.clienteid}</li>` : ''}
                ${filtros.conductorid ? `<li>Conductor ID: ${filtros.conductorid}</li>` : ''}
                ${!filtros.fechaDesde && !filtros.fechaHasta && !filtros.clienteid && !filtros.conductorid ? '<li>Todas las facturas</li>' : ''}
              </ul>
            </div>
            <p>El archivo Excel se encuentra adjunto a este email.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Este es un reporte automático generado por Taxi App.
            </p>
          </div>
        `,
        attachments: [
          {
            filename: filename,
            content: buffer,
          },
        ],
      });
      
      this.logger.log(`✅ Reporte de facturas enviado a: ${email}`);
      this.logger.log(`📋 ID del email: ${result.data?.id || 'N/A'}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Error enviando reporte de facturas a ${email}:`, error);
      this.logger.error(`🔍 Detalles del error:`, {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode
      });
      return false;
    }
  }
} 