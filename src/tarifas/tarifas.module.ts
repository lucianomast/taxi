import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifasService } from './tarifas.service';
import { TarifasController } from './tarifas.controller';
import { GeolocalizacionService } from './geolocalizacion.service';
import { Tarifa } from './entities/tarifa.entity';
import { Festivo } from './entities/festivo.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tarifa, Festivo]),
    AuthModule, // Importar módulo de auth para el guard
  ],
  controllers: [TarifasController],
  providers: [TarifasService, GeolocalizacionService],
  exports: [TarifasService, GeolocalizacionService], // Exportar para usar en otros módulos
})
export class TarifasModule {} 