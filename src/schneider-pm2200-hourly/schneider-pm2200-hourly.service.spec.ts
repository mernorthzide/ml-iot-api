import { Test, TestingModule } from '@nestjs/testing';
import { SchneiderPm2200HourlyService } from './schneider-pm2200-hourly.service';

describe('SchneiderPm2200HourlyService', () => {
  let service: SchneiderPm2200HourlyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchneiderPm2200HourlyService],
    }).compile();

    service = module.get<SchneiderPm2200HourlyService>(SchneiderPm2200HourlyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
