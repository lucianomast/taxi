import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearTarifaDto {
  @ApiProperty({ description: 'Nombre de la tarifa' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Descripción de la tarifa', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ description: 'Tarifa por kilómetro' })
  @IsNumber()
  tarifa_por_km: number;

  @ApiProperty({ description: 'Costo base fijo', default: 5.00 })
  @IsNumber()
  @IsOptional()
  costo_base?: number;

  @ApiProperty({ description: 'Si la tarifa está activa', default: true })
  @IsBoolean()
  @IsOptional()
  activa?: boolean;

  @ApiProperty({ description: 'Fecha de inicio de vigencia', required: false })
  @IsDate()
  @IsOptional()
  fecha_inicio?: Date;

  @ApiProperty({ description: 'Fecha de fin de vigencia', required: false })
  @IsDate()
  @IsOptional()
  fecha_fin?: Date;

  @ApiProperty({ 
    description: 'Condiciones de aplicación de la tarifa (JSON)',
    example: {
      dias_semana: [1, 2, 3, 4, 5],
      horario_inicio: "07:00",
      horario_fin: "21:00",
      festivos: false,
      zona_especial: false,
      tipo_servicio: ["normal"],
      distancia_minima: 0,
      distancia_maxima: null
    }
  })
  @IsObject()
  @IsOptional()
  condiciones?: any;
} 