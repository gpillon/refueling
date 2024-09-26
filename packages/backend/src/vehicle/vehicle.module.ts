import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleGateway } from './vehicle.gateway';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],

  providers: [VehicleGateway, VehicleService],
  controllers: [VehicleController],
  exports: [VehicleService],
})
export class VehicleModule {}
