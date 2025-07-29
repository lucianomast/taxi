import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SolicitarActivacionDto {
  @ApiProperty({ 
    example: 'conductor@ejemplo.com',
    description: 'Email del conductor para enviar código de activación'
  })
  @IsEmail()
  email: string;
} 