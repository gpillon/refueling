import { Test, TestingModule } from '@nestjs/testing';
import { VehicleGateway } from './vehicle.gateway';
import { VehicleService } from './vehicle.service';

describe('VehicleGateway', () => {
  let gateway: VehicleGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleGateway, VehicleService],
    }).compile();

    gateway = module.get<VehicleGateway>(VehicleGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
