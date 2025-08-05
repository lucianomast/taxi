import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalcularPrecioDto {
  @ApiProperty({ description: 'Dirección de origen' })
  @IsString()
  origen: string;

  @ApiProperty({ description: 'Dirección de destino' })
  @IsString()
  destino: string;

  @ApiProperty({ 
    description: 'Latitud del origen (proporcionada por el frontend)', 
    required: false 
  })
  @IsOptional()
  @IsNumberString()
  origenLat?: string;

  @ApiProperty({ 
    description: 'Longitud del origen (proporcionada por el frontend)', 
    required: false 
  })
  @IsOptional()
  @IsNumberString()
  origenLon?: string;

  @ApiProperty({ 
    description: 'Latitud del destino (proporcionada por el frontend)', 
    required: false 
  })
  @IsOptional()
  @IsNumberString()
  destinoLat?: string;

  @ApiProperty({ 
    description: 'Longitud del destino (proporcionada por el frontend)', 
    required: false 
  })
  @IsOptional()
  @IsNumberString()
  destinoLon?: string;

  @ApiProperty({ description: 'Fecha del viaje (YYYY-MM-DD)', required: false })
  @IsString()
  @IsOptional()
  fecha?: string;

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