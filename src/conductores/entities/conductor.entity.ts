import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity('conductores')
export class Conductor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  idProveedor: number;

  @ManyToOne(() => Empresa, empresa => empresa.conductores)
  @JoinColumn({ name: 'idProveedor' })
  empresa: Empresa;

  @Column({ length: 100 })
  razonSocial: string;

  @Column({ type: 'tinyint', default: 1 })
  activoParaAgendados: boolean;

  @Column({ type: 'tinyint', default: 1 })
  activoParaInmediatos: boolean;

  @Column({ length: 40 })
  email: string;

  @Column({ length: 10, default: '12122334H' })
  dni: string;

  @Column({ length: 256 })
  password: string;

  @Column({ length: 20 })
  marcaCoche: string;

  @Column({ length: 20 })
  modeloCoche: string;

  @Column({ length: 20 })
  nombre: string;

  @Column({ length: 150, nullable: true })
  apellidos?: string;

  @Column({ type: 'tinyint', default: 0 })
  soyAdmin: boolean;

  @Column({ type: 'int' })
  estado: number;

  @Column({ length: 30 })
  licencia: string;

  @Column({ length: 10 })
  matricula: string;

  @Column({ type: 'tinyint', default: 1 })
  revisarDistancia: boolean;

  @Column({ length: 15 })
  telefono: string;

  @Column({ length: 500, nullable: true })
  token_pushes?: string;

  @Column({ type: 'int', default: 10 })
  estadoUsuario: number;

  @Column({ type: 'tinyint', default: 0 })
  logado: boolean;

  @Column({ type: 'datetime', nullable: true })
  ultimaPenalizacion?: Date;

  @Column({ type: 'datetime', nullable: true })
  ultimoServicioNoInmediato_at?: Date;

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'date', nullable: true })
  updated_at?: Date;

  @Column({ type: 'date', nullable: true })
  deleted_at?: Date;
} 