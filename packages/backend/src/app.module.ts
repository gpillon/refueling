import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle/entities/vehicle.entity';
import { Refueling } from './refueling/entities/refueling.entity';
import { VehicleModule } from './vehicle/vehicle.module';
import { RefuelingModule } from './refueling/refueling.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

@Module({
  imports: [
    VehicleModule,
    RefuelingModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/database.sqlite',
      entities: [Vehicle, Refueling, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Vehicle, Refueling]),
    PassportModule,
  ],
  providers: [],
})
export class AppModule {}
