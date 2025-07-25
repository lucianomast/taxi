import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Servicio } from '../../servicios/entities/servicio.entity';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  servicioId: number;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: 'servicioId' })
  servicio: Servicio;

  @Column({ type: 'float' })
  importe: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ length: 100 })
  clienteNombre: string;

  @Column({ length: 100 })
  empresaNombre: string;

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'date', nullable: true })
  updated_at?: Date;

  @Column({ type: 'date', nullable: true })
  deleted_at?: Date;
} 