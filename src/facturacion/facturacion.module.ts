import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturacionService } from './facturacion.service';
import { FacturacionController } from './facturacion.controller';
import { Factura } from './entities/factura.entity';
import { Servicio } from '../servicios/entities/servicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Servicio])],
  controllers: [FacturacionController],
  providers: [FacturacionService],
})
export class FacturacionModule {} 