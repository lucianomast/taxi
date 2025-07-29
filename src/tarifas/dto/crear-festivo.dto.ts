import { IsDate, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearFestivoDto {
  @ApiProperty({ description: 'Fecha del festivo' })
  @IsDate()
  fecha: Date;

  @ApiProperty({ description: 'Nombre del festivo' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Descripción del festivo', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ description: 'Si el festivo está activo', default: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
} 