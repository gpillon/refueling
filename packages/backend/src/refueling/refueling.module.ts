import { Module } from '@nestjs/common';
import { RefuelingService } from './refueling.service';
import { RefuelingGateway } from './refueling.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refueling } from './entities/refueling.entity';
import { VehicleModule } from '../vehicle/vehicle.module';
import { RefuelingController } from './refueling.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Refueling]), VehicleModule],
  providers: [RefuelingGateway, RefuelingService],
  controllers: [RefuelingController],
})
export class RefuelingModule {}
