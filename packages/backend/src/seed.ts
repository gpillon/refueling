import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { UsersService } from './auth/users.service';
import { AppModule } from './app.module';
import { RefuelingService } from './refueling/refueling.service';
import { VehicleService } from './vehicle/vehicle.service';
import { FuelType } from './refueling/refueling.types';
async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const vehicleService = app.get(VehicleService);
  const refuelingService = app.get(RefuelingService);

  // Seed Users
  const users = [
    { username: 'admin', password: 'admin' },
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const existingUser = await usersService.findOne(user.username);
    if (existingUser) {
      console.log(`User ${user.username} already exists`);
      continue;
    }
    await usersService.create({ ...user, password: hashedPassword });
  }

  console.log('Users seeded');

  // Seed Vehicles
  const vehicleMakes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan'];
  const vehicleModels = ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Van'];

  for (let i = 0; i < 20; i++) {
    const make = vehicleMakes[Math.floor(Math.random() * vehicleMakes.length)];
    const model =
      vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
    const year = 2010 + Math.floor(Math.random() * 14); // Random year between 2010 and 2023

    await vehicleService.create({
      make,
      model,
      year,
      plate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      type: model,
    });
  }

  console.log('Vehicles seeded');
  // Seed Refuelings
  const vehicles = await vehicleService.findAll();

  for (const vehicle of vehicles) {
    const refuelingsCount = 5 + Math.floor(Math.random() * 16); // 5 to 20 refuelings per vehicle

    for (let i = 0; i < refuelingsCount; i++) {
      const currentDate = new Date();
      const twoMonthsAgo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 2,
        currentDate.getDate(),
      );
      const date = new Date(
        twoMonthsAgo.getTime() +
          Math.random() * (currentDate.getTime() - twoMonthsAgo.getTime()),
      );
      const liters = 20 + Math.random() * 40; // 20 to 60 liters
      const cost = liters * (1.5 + Math.random()); // Random price per liter between 1.5 and 2.5
      const kilometers = 100 + Math.random() * 400; // 100 to 500 kilometers

      await refuelingService.create({
        date,
        liters,
        fuelType: FuelType.GASOLINE,
        cost,
        kilometers,
        vehicleId: vehicle.id,
      });
    }
  }

  console.log('Refuelings seeded');

  await app.close();
  console.log('Seeding completed');
}
seed();
