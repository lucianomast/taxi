import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearServicioDto {
  @ApiProperty({ example: 58, description: 'ID del cliente' })
  @IsInt()
  clienteId: number;

  @ApiProperty({ example: 2, required: false, description: 'ID del conductor (opcional)' })
  @IsOptional()
  @IsInt()
  conductorId?: number;

  @ApiProperty({ example: 'Origen ficticio #8' })
  @IsString()
  origen: string;

  @ApiProperty({ example: 'Destino ficticio #193' })
  @IsString()
  destino: string;

  @ApiProperty({ example: '40.345247' })
  @IsString()
  origenLat: string;

  @ApiProperty({ example: '-3.819113' })
  @IsString()
  origenLon: string;

  @ApiProperty({ example: '40.403342' })
  @IsString()
  destinoLat: string;

  @ApiProperty({ example: '-3.738408' })
  @IsString()
  destinoLon: string;

  @ApiProperty({ example: 40, description: 'Estado del servicio' })
  @IsInt()
  estado: number;

  @ApiProperty({ example: 22, description: 'ID del admin' })
  @IsInt()
  adminId: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  inmediato?: boolean;

  @ApiProperty({ example: 'Observaciones del servicio', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({ example: 'Comentario del servicio', required: false })
  @IsOptional()
  @IsString()
  comentarioServicio?: string;

  @ApiProperty({ example: 'T', required: false, description: 'Forma de pago (E efectivo, T tarjeta, etc.)' })
  @IsOptional()
  @IsString()
  formaPago?: string;

  @ApiProperty({ example: 22.43, required: false })
  @IsOptional()
  @IsInt()
  precio?: number;
} 