import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '47461872S', description: 'DNI o email del usuario' })
  @IsString()
  usermail: string;

  @ApiProperty({ example: 'miclave', description: 'Contraseña del usuario' })
  @IsString()
  password: string;
} 