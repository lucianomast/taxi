import { IsString, IsOptional, IsInt, IsBoolean, IsNumberString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoServicio, ESTADO_SERVICIO_VALORES } from '../enums/estado-servicio.enum';

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

  @ApiProperty({ example: 'Santa Teresa 2227, Morón', description: 'Dirección de origen' })
  @IsString()
  origen: string;

  @ApiProperty({ example: 'rafael castillo', description: 'Dirección de destino' })
  @IsString()
  destino: string;

  @ApiProperty({ 
    example: '40.345247', 
    description: 'Latitud del origen (proporcionada por el frontend)' 
  })
  @IsNumberString()
  origenLat: string;

  @ApiProperty({ 
    example: '-3.819113', 
    description: 'Longitud del origen (proporcionada por el frontend)' 
  })
  @IsNumberString()
  origenLon: string;

  @ApiProperty({ 
    example: '40.403342', 
    description: 'Latitud del destino (proporcionada por el frontend)' 
  })
  @IsNumberString()
  destinoLat: string;

  @ApiProperty({ 
    example: '-3.738408', 
    description: 'Longitud del destino (proporcionada por el frontend)' 
  })
  @IsNumberString()
  destinoLon: string;

  @ApiProperty({ 
    example: 10, 
    description: `Estado del servicio. Valores válidos: ${ESTADO_SERVICIO_VALORES.map(e => `${e.valor}=${e.descripcion}`).join(', ')}`,
    enum: EstadoServicio,
    enumName: 'EstadoServicio'
  })
  @IsEnum(EstadoServicio, { 
    message: `Estado debe ser uno de los siguientes valores: ${ESTADO_SERVICIO_VALORES.map(e => `${e.valor} (${e.descripcion})`).join(', ')}` 
  })
  estado: EstadoServicio;

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