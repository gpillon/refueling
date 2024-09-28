import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { FuelType } from '../refueling.types';

export class ReadRefuelingDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2021-01-01' })
  date: Date;

  @ApiProperty({ example: 1000 })
  liters: number;

  @ApiProperty({ example: 1000 })
  cost: number;

  @ApiProperty({ example: 1000 })
  kilometers: number;

  @ApiProperty({ enum: FuelType })
  fuelType: FuelType;

  @ApiProperty({ example: 1 })
  vehicleId: number;

  @Exclude()
  vehicle?: never;
}
