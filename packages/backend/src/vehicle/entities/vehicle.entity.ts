import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Refueling } from '../../refueling/entities/refueling.entity';
@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column({ default: '' })
  plate: string;

  @Column({ default: '' })
  type: string;

  @Column()
  year: number;

  @OneToMany(() => Refueling, (refueling) => refueling.vehicle)
  refuelings: Refueling[];
}
