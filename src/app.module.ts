import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { ConductoresModule } from './conductores/conductores.module';
import { FacturacionModule } from './facturacion/facturacion.module';
import { EmpresasModule } from './empresas/empresas.module';
import { ServiciosModule } from './servicios/servicios.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // Configuración que funciona tanto en local como en producción
      type: process.env.DB_TYPE === 'postgres' ? 'postgres' : 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'taxi_db',
      // Railway usa estas variables automáticamente
      // DATABASE_URL, MYSQL_URL, o POSTGRES_URL
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false,
      } : false,
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
  // controllers: [],
  // providers: [],
})
export class AppModule {}
