import { IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CambiarPasswordCodigoDto {
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

  @ApiProperty({ 
    example: 'nuevaPassword123',
    description: 'Nueva contraseña (mínimo 6 caracteres)'
  })
  @IsString()
  @MinLength(6)
  nuevaPassword: string;
} 