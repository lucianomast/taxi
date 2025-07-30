import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class PenalizarConductorDto {
  @ApiProperty({
    description: 'ID del conductor a penalizar',
    example: 1
  })
  @IsNumber()
  conductorId: number;

  @ApiProperty({
    description: 'Motivo de la penalización',
    example: 'Rechazo de servicio',
    required: false
  })
  @IsString()
  @IsOptional()
  motivo?: string;

  @ApiProperty({
    description: 'Tipo de penalización: manual o automatica',
    example: 'manual',
    enum: ['manual', 'automatica']
  })
  @IsString()
  tipo: 'manual' | 'automatica';
} 