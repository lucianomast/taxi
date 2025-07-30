import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetLocationDto {
  @ApiProperty({
    description: 'Dirección para obtener coordenadas',
    example: 'Calle Mayor 123, Madrid, España'
  })
  @IsString()
  @IsNotEmpty()
  address: string;
} 