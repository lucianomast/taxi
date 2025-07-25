import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';
import { Empresa } from '../empresas/entities/empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Empresa])],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {} 