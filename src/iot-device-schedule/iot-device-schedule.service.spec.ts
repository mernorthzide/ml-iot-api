import { Test, TestingModule } from '@nestjs/testing';
import { IotDeviceScheduleService } from './iot-device-schedule.service';

describe('IotDeviceScheduleService', () => {
  let service: IotDeviceScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IotDeviceScheduleService],
    }).compile();

    service = module.get<IotDeviceScheduleService>(IotDeviceScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
