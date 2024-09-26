import { Test, TestingModule } from '@nestjs/testing';
import { RefuelingService } from './refueling.service';

describe('RefuelingService', () => {
  let service: RefuelingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefuelingService],
    }).compile();

    service = module.get<RefuelingService>(RefuelingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
