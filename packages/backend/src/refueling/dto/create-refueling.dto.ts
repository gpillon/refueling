import { IsDate, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FuelType } from '../refueling.types';

export class CreateRefuelingDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  liters: number;

  @ApiProperty()
  @IsEnum(FuelType)
  @IsNotEmpty()
  fuelType: FuelType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  kilometers: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  vehicleId: number;
}
