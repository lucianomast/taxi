import { IsOptional, IsString, IsNumber, IsEmail, IsDateString, ValidateNested, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FiltrosFacturaDto {
  @ApiProperty({ 
    description: 'Fecha de inicio para filtrar facturas (formato: YYYY-MM-DD). Si no se especifica, no se aplica filtro de fecha inicial.', 
    example: '2022-05-01',
    required: false,
    type: String
  })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiProperty({ 
    description: 'Fecha de fin para filtrar facturas (formato: YYYY-MM-DD). Si no se especifica, no se aplica filtro de fecha final.', 
    example: '2022-05-31',
    required: false,
    type: String
  })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @ApiProperty({ 
    description: 'ID del cliente para filtrar facturas específicas de ese cliente. Si no se especifica, se incluyen facturas de todos los clientes.', 
    example: 4,
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  clienteid?: number;

  @ApiProperty({ 
    description: 'ID del conductor para filtrar facturas específicas de ese conductor. Si no se especifica, se incluyen facturas de todos los conductores.', 
    example: 1,
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  conductorid?: number;
}

export class FiltrarFacturaDto {
  @ApiProperty({ 
    description: 'Objeto que contiene todos los filtros opcionales para la búsqueda de facturas. Puede estar vacío para obtener todas las facturas.',
    type: FiltrosFacturaDto,
    required: true
  })
  @IsObject()
  @ValidateNested()
  @Type(() => FiltrosFacturaDto)
  filtros: FiltrosFacturaDto;

  @ApiProperty({ 
    description: 'Dirección de email donde se enviará el archivo Excel con el reporte de facturas. Debe ser un email válido.', 
    example: 'admin@empresa.com',
    required: true,
    type: String
  })
  @IsEmail()
  usermail: string;
}
