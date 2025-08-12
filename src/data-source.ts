import { DataSource } from 'typeorm';
import { Conductor } from './conductores/entities/conductor.entity';
import { ConductorPosicion } from './conductores/entities/conductor-posicion.entity';
import { Cliente } from './clientes/entities/cliente.entity';
import { Empresa } from './empresas/entities/empresa.entity';
import { Servicio } from './servicios/entities/servicio.entity';
import { Factura } from './facturacion/entities/factura.entity';
import { Tarifa } from './tarifas/entities/tarifa.entity';
import { Festivo } from './tarifas/entities/festivo.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'trolley.proxy.rlwy.net',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 49619,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'EHpUGGfgpQhfuHqavglpiHTCoCJHMByk',
  database: process.env.DB_DATABASE || 'Taxi',
  ssl: process.env.DB_SSL === 'true' ? true : false,
  synchronize: false,
  logging: false,
  entities: [Conductor, ConductorPosicion, Cliente, Empresa, Servicio, Factura, Tarifa, Festivo],
  migrations: [__dirname + '/migrations/*.ts'],
  subscribers: [],
}); 