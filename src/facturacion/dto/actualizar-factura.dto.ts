import { PartialType } from '@nestjs/mapped-types';
import { CrearFacturaDto } from './crear-factura.dto';

export class ActualizarFacturaDto extends PartialType(CrearFacturaDto) {} 