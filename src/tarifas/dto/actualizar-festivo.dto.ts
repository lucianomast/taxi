import { PartialType } from '@nestjs/mapped-types';
import { CrearFestivoDto } from './crear-festivo.dto';

export class ActualizarFestivoDto extends PartialType(CrearFestivoDto) {} 