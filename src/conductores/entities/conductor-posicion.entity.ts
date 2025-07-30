import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Conductor } from './conductor.entity';

@Entity('conductor_posicion')
export class ConductorPosicion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  conductorId: number;

  @OneToOne(() => Conductor, conductor => conductor.posicion)
  @JoinColumn({ name: 'conductorId' })
  conductor: Conductor;

  @Column({ length: 50, nullable: true })
  lat: string;

  @Column({ length: 50, nullable: true })
  lon: string;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime' })
  updated_at: Date;
} 