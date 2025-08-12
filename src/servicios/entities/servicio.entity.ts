import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Conductor } from '../../conductores/entities/conductor.entity';
import { EstadoServicio } from '../enums/estado-servicio.enum';

@Entity('servicios')
export class Servicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  clienteId: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column({ type: 'int', nullable: true })
  conductorId?: number;

  @ManyToOne(() => Conductor, { nullable: true })
  @JoinColumn({ name: 'conductorId' })
  conductor?: Conductor;

  @Column({ length: 200 })
  origen: string;

  @Column({ length: 200 })
  destino: string;

  @Column({ length: 20 })
  origenLat: string;

  @Column({ length: 20 })
  origenLon: string;

  @Column({ length: 20 })
  destinoLat: string;

  @Column({ length: 20 })
  destinoLon: string;

  @Column({ 
    type: 'int',
    comment: 'Estado del servicio: 7=Reserva, 10=Asignado, 15=Confirmado, 20=En ruta, 25=En puerta, 30=Con cliente, 40=Finalizado, 90=Cancelado'
  })
  estado: EstadoServicio;

  @Column({ type: 'int' })
  adminId: number;

  @ManyToOne(() => Conductor, { nullable: false })
  @JoinColumn({ name: 'adminId' })
  admin: Conductor;

  @Column({ type: 'tinyint', default: 0 })
  inmediato: boolean;

  @Column({ length: 1000, nullable: true })
  observaciones?: string;

  @Column({ length: 1000, nullable: true })
  comentarioServicio?: string;

  @Column({ length: 10, nullable: true })
  formaPago?: string;

  @Column({ type: 'float', nullable: true })
  precio?: number;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  updated_at?: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_at?: Date;
} 