import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { Servicio } from './entities/servicio.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Conductor } from '../conductores/entities/conductor.entity';
import { TarifasModule } from '../tarifas/tarifas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Servicio, Cliente, Conductor]),
    TarifasModule, // Importar módulo de tarifas
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService],
})
export class ServiciosModule {} 