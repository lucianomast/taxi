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
      // Configuración para Railway usando variables individuales
      type: 'mysql',
      host: process.env.MYSQLHOST || 'localhost',
      port: parseInt(process.env.MYSQLPORT || '3306'),
      username: process.env.MYSQLUSER || 'root',
      password: process.env.MYSQLPASSWORD || '',
      database: process.env.MYSQLDATABASE || 'railway',
      ssl: false, // Deshabilitar SSL para Railway
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
