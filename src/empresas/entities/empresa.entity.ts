import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Conductor } from '../../conductores/entities/conductor.entity';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  cc: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 20 })
  cif: string;

  @Column({ type: 'tinyint', default: 1 })
  abonado: boolean;

  @Column({ length: 200 })
  razonSocial: string;

  @Column({ length: 1000 })
  domicilioFiscal: string;

  @Column({ length: 50 })
  contacto1: string;

  @Column({ length: 15 })
  tlf1: string;

  @Column({ length: 50 })
  email1: string;

  @Column({ length: 10 })
  facturacion: string;

  @Column({ length: 1000, nullable: true })
  observaciones?: string;

  @Column({ length: 10, default: 'ACTIVO' })
  estado: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  created_at: Date;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  updated_at: Date;

  @Column({ type: 'date', nullable: true })
  deleted_at?: Date;

  @OneToMany(() => Cliente, cliente => cliente.empresa)
  clientes: Cliente[];

  @OneToMany(() => Conductor, conductor => conductor.empresa)
  conductores: Conductor[];
} 