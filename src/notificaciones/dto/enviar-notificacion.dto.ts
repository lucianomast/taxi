import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnviarNotificacionDto {
  @ApiProperty({ example: '600000001', description: 'Teléfono o identificador del destinatario' })
  @IsString()
  destinatario: string;

  @ApiProperty({ example: '¡Tienes un nuevo viaje asignado!', description: 'Mensaje de la notificación' })
  @IsString()
  mensaje: string;
} 