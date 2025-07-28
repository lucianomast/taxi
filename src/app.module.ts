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
      // Configuración para base de datos local (XAMPP)
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'taxi_db',
      ssl: false,
      autoLoadEntities: true,
      synchronize: false,
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
