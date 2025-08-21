import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { ServiciosCronService } from './servicios-cron.service';
import { Servicio } from './entities/servicio.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Conductor } from '../conductores/entities/conductor.entity';
import { ConductorPosicion } from '../conductores/entities/conductor-posicion.entity';
import { TarifasModule } from '../tarifas/tarifas.module';
import { AuthModule } from '../auth/auth.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Servicio, Cliente, Conductor, ConductorPosicion]),
    ScheduleModule.forRoot(), // Habilitar tareas programadas
    TarifasModule, // Importar módulo de tarifas
    AuthModule, // Importar módulo de auth para el guard
    NotificacionesModule, // Importar módulo de notificaciones
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService, ServiciosCronService],
})
export class ServiciosModule {} 