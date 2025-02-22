import { Test, TestingModule } from '@nestjs/testing';
import { SchneiderPm2200HourlyController } from './schneider-pm2200-hourly.controller';
import { SchneiderPm2200HourlyService } from './schneider-pm2200-hourly.service';

describe('SchneiderPm2200HourlyController', () => {
  let controller: SchneiderPm2200HourlyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchneiderPm2200HourlyController],
      providers: [SchneiderPm2200HourlyService],
    }).compile();

    controller = module.get<SchneiderPm2200HourlyController>(SchneiderPm2200HourlyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
