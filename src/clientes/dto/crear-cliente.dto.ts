import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CrearClienteDto {
  @ApiProperty({ example: 'Ana' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: '600000001' })
  @IsString()
  telefono: string;

  @ApiProperty({ example: '+34', required: false })
  @IsOptional()
  @IsString()
  prefijo?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  ocultarTelefono?: boolean;

  @ApiProperty({ example: 'ana@correo.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Cliente frecuente', required: false })
  @IsOptional()
  @IsString()
  informacionCliente?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  informacionAdicional?: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  estadoUsuario: number;

  @ApiProperty({ example: 'Pérez Mora', required: false })
  @IsOptional()
  @IsString()
  apellidos?: string;

  @ApiProperty({ example: 'C. Inventada, 123, 28000 Madrid, España', required: false })
  @IsOptional()
  @IsString()
  direccionHabitual?: string;

  @ApiProperty({ example: 23, required: false })
  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @ApiProperty({ example: '40.4000000', required: false })
  @IsOptional()
  @IsString()
  lat?: string;

  @ApiProperty({ example: '-3.7000000', required: false })
  @IsOptional()
  @IsString()
  lon?: string;
} 