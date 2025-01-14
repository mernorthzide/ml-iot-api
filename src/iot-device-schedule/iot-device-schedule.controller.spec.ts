import { Test, TestingModule } from '@nestjs/testing';
import { IotDeviceScheduleController } from './iot-device-schedule.controller';
import { IotDeviceScheduleService } from './iot-device-schedule.service';

describe('IotDeviceScheduleController', () => {
  let controller: IotDeviceScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IotDeviceScheduleController],
      providers: [IotDeviceScheduleService],
    }).compile();

    controller = module.get<IotDeviceScheduleController>(IotDeviceScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
