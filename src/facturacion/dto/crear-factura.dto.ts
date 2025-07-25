import { IsInt, IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearFacturaDto {
  @ApiProperty({ example: 1100, description: 'ID del servicio asociado a la factura' })
  @IsInt()
  servicioId: number;

  @ApiProperty({ example: 120.50, description: 'Importe total de la factura' })
  @IsNumber()
  importe: number;

  @ApiProperty({ example: '2024-07-25', description: 'Fecha de la factura (YYYY-MM-DD)' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ example: 'Ana Pérez', description: 'Nombre del cliente' })
  @IsString()
  clienteNombre: string;

  @ApiProperty({ example: 'DemoCorp S.A.', description: 'Nombre de la empresa' })
  @IsString()
  empresaNombre: string;
} 