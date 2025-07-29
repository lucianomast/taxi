import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearEmpresaDto {
  @ApiProperty({ example: 0, required: false, description: 'Código de cliente (opcional)' })
  @IsOptional()
  @IsInt()
  cc?: number;

  @ApiProperty({ example: 'DemoCorp S.A.' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'A12345678' })
  @IsString()
  cif: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  abonado?: boolean;

  @ApiProperty({ example: 'DemoCorp Soluciones Integrales' })
  @IsString()
  razonSocial: string;

  @ApiProperty({ example: 'Calle Ficción 123, Zona Beta, Madrid' })
  @IsString()
  domicilioFiscal: string;

  @ApiProperty({ example: 'Ana Duarte' })
  @IsString()
  contacto1: string;

  @ApiProperty({ example: '600100100' })
  @IsString()
  tlf1: string;

  @ApiProperty({ example: 'ana@democorp.test' })
  @IsString()
  email1: string;

  @ApiProperty({ example: 'NINGUNA' })
  @IsString()
  facturacion: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({ example: 'ACTIVO' })
  @IsString()
  estado: string;
} 