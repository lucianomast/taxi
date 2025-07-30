import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearServicioDto {
  @ApiProperty({ example: 58, description: 'ID del cliente' })
  @IsInt()
  clienteId: number;

  @ApiProperty({ 
    example: 2, 
    required: false, 
    description: 'ID del conductor (opcional). Si inmediato=true y no se proporciona, se asigna automáticamente el conductor más cercano' 
  })
  @IsOptional()
  @IsInt()
  conductorId?: number;

  @ApiProperty({ example: 'Santa Teresa 2227, Morón', description: 'Dirección de origen (se geocodifica automáticamente)' })
  @IsString()
  origen: string;

  @ApiProperty({ example: 'rafael castillo', description: 'Dirección de destino (se geocodifica automáticamente)' })
  @IsString()
  destino: string;

  @ApiProperty({ 
    example: '40.345247', 
    required: false, 
    description: 'Latitud del origen (se obtiene automáticamente por geocodificación si no se proporciona)' 
  })
  @IsOptional()
  @IsString()
  origenLat?: string;

  @ApiProperty({ 
    example: '-3.819113', 
    required: false, 
    description: 'Longitud del origen (se obtiene automáticamente por geocodificación si no se proporciona)' 
  })
  @IsOptional()
  @IsString()
  origenLon?: string;

  @ApiProperty({ 
    example: '40.403342', 
    required: false, 
    description: 'Latitud del destino (se obtiene automáticamente por geocodificación si no se proporciona)' 
  })
  @IsOptional()
  @IsString()
  destinoLat?: string;

  @ApiProperty({ 
    example: '-3.738408', 
    required: false, 
    description: 'Longitud del destino (se obtiene automáticamente por geocodificación si no se proporciona)' 
  })
  @IsOptional()
  @IsString()
  destinoLon?: string;

  @ApiProperty({ example: 10, description: 'Estado del servicio' })
  @IsInt()
  estado: number;

  @ApiProperty({ example: 1, description: 'ID del admin' })
  @IsInt()
  adminId: number;

  @ApiProperty({ 
    example: true, 
    required: false, 
    description: 'Si es true, asigna automáticamente el conductor más cercano disponible' 
  })
  @IsOptional()
  @IsBoolean()
  inmediato?: boolean;

  @ApiProperty({ example: 'Cliente VIP', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  comentarioServicio?: string;

  @ApiProperty({ example: 'Efectivo', required: false, description: 'Forma de pago (Efectivo, Tarjeta, etc.)' })
  @IsOptional()
  @IsString()
  formaPago?: string;

  @ApiProperty({ 
    example: 22.43, 
    required: false, 
    description: 'Precio del servicio (se calcula automáticamente usando la API de tarifas si no se proporciona)' 
  })
  @IsOptional()
  @IsInt()
  precio?: number;
} 