import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { ConductoresModule } from './conductores/conductores.module';
import { FacturacionModule } from './facturacion/facturacion.module';
import { EmpresasModule } from './empresas/empresas.module';
import { ServiciosModule } from './servicios/servicios.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql' || 'mysql',
      host: process.env.DB_HOST || 'trolley.proxy.rlwy.net',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 49619,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'EHpUGGfgpQhfuHqavglpiHTCoCJHMByk',
      database: process.env.DB_DATABASE || 'Taxi',
      ssl: process.env.DB_SSL === 'true' ? true : false,
      autoLoadEntities: true,
      synchronize: false,
      logging: true, // Habilitar logs de SQL para debug
    }),
    AuthModule,
    ClientesModule,
    ConductoresModule,
    FacturacionModule,
    EmpresasModule,
    ServiciosModule,
    NotificacionesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
