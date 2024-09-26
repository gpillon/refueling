import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle/entities/vehicle.entity';
import { Refueling } from './refueling/entities/refueling.entity';
import { VehicleModule } from './vehicle/vehicle.module';
import { RefuelingModule } from './refueling/refueling.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { RouterModule } from '@nestjs/core';
import { UsersModule } from './auth/users.module';

@Module({
  imports: [
    VehicleModule,
    RefuelingModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'vehicles',
            module: VehicleModule,
          },
          {
            path: 'refuelings',
            module: RefuelingModule,
          },
          {
            path: 'users',
            module: UsersModule,
          },
        ],
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/database.sqlite',
      entities: [Vehicle, Refueling, User],
      synchronize: true,
    }),
    AuthModule,
    TypeOrmModule.forFeature([Vehicle, Refueling]),
    PassportModule,
  ],
  providers: [],
})
export class AppModule {}
