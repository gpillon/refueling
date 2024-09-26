import { Test, TestingModule } from '@nestjs/testing';
import { RefuelingGateway } from './refueling.gateway';
import { RefuelingService } from './refueling.service';

describe('RefuelingGateway', () => {
  let gateway: RefuelingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefuelingGateway, RefuelingService],
    }).compile();

    gateway = module.get<RefuelingGateway>(RefuelingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
