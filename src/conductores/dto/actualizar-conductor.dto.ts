import { PartialType } from '@nestjs/mapped-types';
import { CrearConductorDto } from './crear-conductor.dto';

export class ActualizarConductorDto extends PartialType(CrearConductorDto) {} 