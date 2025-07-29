import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifasService } from './tarifas.service';
import { TarifasController } from './tarifas.controller';
import { GeolocalizacionService } from './geolocalizacion.service';
import { Tarifa } from './entities/tarifa.entity';
import { Festivo } from './entities/festivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarifa, Festivo])],
  controllers: [TarifasController],
  providers: [TarifasService, GeolocalizacionService],
  exports: [TarifasService, GeolocalizacionService], // Exportar para usar en otros módulos
})
export class TarifasModule {} 