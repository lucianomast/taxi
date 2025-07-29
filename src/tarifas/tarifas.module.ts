import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifasService } from './tarifas.service';
import { TarifasController } from './tarifas.controller';
import { Tarifa } from './entities/tarifa.entity';
import { Festivo } from './entities/festivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarifa, Festivo])],
  controllers: [TarifasController],
  providers: [TarifasService],
  exports: [TarifasService], // Exportar para usar en otros módulos
})
export class TarifasModule {} 