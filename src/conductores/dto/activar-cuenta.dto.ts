import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivarCuentaDto {
  @ApiProperty({ 
    example: 'conductor@ejemplo.com',
    description: 'Email del conductor'
  })
  @IsString()
  email: string;

  @ApiProperty({ 
    example: '123456',
    description: 'Código de 6 dígitos enviado por email'
  })
  @IsString()
  @Length(6, 6)
  codigo: string;
} 