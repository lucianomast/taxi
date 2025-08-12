import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExportarClientesDto {
  @ApiProperty({
    example: 'admin@empresa.com',
    description: 'Email donde se enviará la lista de clientes en formato Excel'
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;
}
