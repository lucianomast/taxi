import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConductoresService } from './conductores.service';
import { ConductoresController } from './conductores.controller';
import { Conductor } from './entities/conductor.entity';
import { ConductorPosicion } from './entities/conductor-posicion.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conductor, ConductorPosicion, Empresa]), EmailModule],
  controllers: [ConductoresController],
  providers: [ConductoresService],
})
export class ConductoresModule {}
