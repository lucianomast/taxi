import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConductoresService } from './conductores.service';
import { ConductoresController } from './conductores.controller';
import { Conductor } from './entities/conductor.entity';
import { Empresa } from '../empresas/entities/empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conductor, Empresa])],
  controllers: [ConductoresController],
  providers: [ConductoresService],
})
export class ConductoresModule {}
