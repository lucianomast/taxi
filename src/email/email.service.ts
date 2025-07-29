import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend('re_GdNFSwpN_2G9GvdamwSHjiSQVE5GR1m58');
  }

  async enviarCodigoActivacion(email: string, codigo: string, nombre: string): Promise<boolean> {
    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
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
      return true;
    } catch (error) {
      console.error('Error enviando email:', error);
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
      await this.resend.emails.send({
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
      return true;
    } catch (error) {
      console.error('Error enviando email de confirmación de cambio:', error);
      return false;
    }
  }
} 