import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturacionService } from './facturacion.service';
import { FacturacionController } from './facturacion.controller';
import { Factura } from './entities/factura.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Servicio]), EmailModule],
  controllers: [FacturacionController],
  providers: [FacturacionService],
})
export class FacturacionModule {} 