import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class GuardarCoordenadasDto {
  @ApiProperty({
    description: 'ID del conductor',
    example: 1
  })
  @IsNumber()
  conductorId: number;

  @ApiProperty({
    description: 'Latitud del conductor',
    example: '40.4168',
    required: false
  })
  @IsString()
  @IsOptional()
  lat?: string;

  @ApiProperty({
    description: 'Longitud del conductor',
    example: '-3.7038',
    required: false
  })
  @IsString()
  @IsOptional()
  lon?: string;
} 