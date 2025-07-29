import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalcularPrecioDto {
  @ApiProperty({ description: 'Distancia en kilómetros' })
  @IsNumber()
  distancia_km: number;

  @ApiProperty({ description: 'Fecha del viaje', required: false })
  @IsDate()
  @IsOptional()
  fecha?: Date;

  @ApiProperty({ description: 'Hora del viaje (HH:MM)', required: false })
  @IsString()
  @IsOptional()
  hora?: string;

  @ApiProperty({ description: 'Tipo de servicio', default: 'normal' })
  @IsString()
  @IsOptional()
  tipo_servicio?: string;

  @ApiProperty({ description: 'Zona del servicio', required: false })
  @IsString()
  @IsOptional()
  zona?: string;
} 