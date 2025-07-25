import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearConductorDto {
  @ApiProperty({ example: 1, description: 'ID de la empresa proveedora' })
  @IsInt()
  idProveedor: number;

  @ApiProperty({ example: 'Overtek S.L', description: 'Razón social del conductor' })
  @IsString()
  razonSocial: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activoParaAgendados?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activoParaInmediatos?: boolean;

  @ApiProperty({ example: 'martin@example.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '47461872S' })
  @IsString()
  dni: string;

  @ApiProperty({ example: 'miclave' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Tesla' })
  @IsString()
  marcaCoche: string;

  @ApiProperty({ example: 's3' })
  @IsString()
  modeloCoche: string;

  @ApiProperty({ example: 'Martín' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Domínguez', required: false })
  @IsOptional()
  @IsString()
  apellidos?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  soyAdmin?: boolean;

  @ApiProperty({ example: 10, description: '10 Disponible / 20 Ocupado TE / 30 fuera de servicio / 40 ocupado' })
  @IsInt()
  estado: number;

  @ApiProperty({ example: 'jhhj' })
  @IsString()
  licencia: string;

  @ApiProperty({ example: '1377CVX' })
  @IsString()
  matricula: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  revisarDistancia?: boolean;

  @ApiProperty({ example: '664001824' })
  @IsString()
  telefono: string;

  @ApiProperty({ example: 'd6HoPD0JQm2l8xSsD3D...', required: false })
  @IsOptional()
  @IsString()
  token_pushes?: string;

  @ApiProperty({ example: 10, required: false, description: '10 Activo / 80 Bloqueado / 90 Eliminado' })
  @IsOptional()
  @IsInt()
  estadoUsuario?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  logado?: boolean;
} 