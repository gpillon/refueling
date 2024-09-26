import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth/user.entity';
import { Vehicle } from './vehicle/entities/vehicle.entity';
import { Refueling } from './refueling/entities/refueling.entity';

async function cleanDb() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const vehicleRepository = app.get<Repository<Vehicle>>(
    getRepositoryToken(Vehicle),
  );
  const refuelingRepository = app.get<Repository<Refueling>>(
    getRepositoryToken(Refueling),
  );

  try {
    await refuelingRepository.clear();
    console.log('Refueling table cleared');

    await vehicleRepository.clear();
    console.log('Vehicle table cleared');

    await userRepository.clear();
    console.log('User table cleared');

    console.log('All tables have been cleared successfully');
  } catch (error) {
    console.error('Error clearing tables:', error);
  } finally {
    await app.close();
  }
}

cleanDb();
