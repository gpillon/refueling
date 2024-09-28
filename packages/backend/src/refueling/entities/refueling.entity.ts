import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FuelType } from '../refueling.types';

@Entity()
export class Refueling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('float', { default: 0 })
  liters: number;

  @Column('float', { default: 0 })
  cost: number;

  @Column('float', { default: 0 })
  kilometers: number;

  @Column({ default: FuelType.GASOLINE })
  fuelType: FuelType;

  @Column({ nullable: false })
  vehicleId: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.refuelings, {
    onDelete: 'CASCADE',
    eager: true,

  })
  vehicle: Vehicle;
}
