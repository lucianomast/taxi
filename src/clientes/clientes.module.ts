import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Empresa]), EmailModule],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {} 