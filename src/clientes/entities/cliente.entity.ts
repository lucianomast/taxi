import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  nombre: string;

  @Column({ length: 15 })
  telefono: string;

  @Column({ length: 10, nullable: true })
  prefijo?: string;

  @Column({ type: 'tinyint', default: 0 })
  ocultarTelefono: boolean;

  @Column({ length: 40, nullable: true })
  email?: string;

  @Column({ length: 256, nullable: true })
  password?: string;

  @Column({ type: 'int', default: 10 })
  estadoUsuario: number;

  @Column({ length: 100, nullable: true })
  apellidos?: string;

  @Column({ length: 2000, nullable: true })
  informacionCliente?: string;

  @Column({ length: 300, nullable: true })
  direccionHabitual?: string;

  @Column({ length: 3000, nullable: true })
  informacionAdicional?: string;

  @Column({ length: 50, nullable: true })
  lat?: string;

  @Column({ length: 50, nullable: true })
  lon?: string;

  @Column({ type: 'int', nullable: true })
  empresaId?: number;

  @ManyToOne(() => Empresa, empresa => empresa.clientes)
  @JoinColumn({ name: 'empresaId' })
  empresa?: Empresa;

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'date', nullable: true })
  updated_at?: Date;

  @Column({ type: 'date', nullable: true })
  deleted_at?: Date;
} 