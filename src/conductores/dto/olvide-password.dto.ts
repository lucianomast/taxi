import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OlvidePasswordDto {
  @ApiProperty({ 
    example: 'conductor@ejemplo.com',
    description: 'Email del conductor para enviar código de recuperación'
  })
  @IsEmail()
  email: string;
} 