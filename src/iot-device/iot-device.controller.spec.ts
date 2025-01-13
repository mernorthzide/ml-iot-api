import { Test, TestingModule } from '@nestjs/testing';
import { IotDeviceController } from './iot-device.controller';
import { IotDeviceService } from './iot-device.service';

describe('IotDeviceController', () => {
  let controller: IotDeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IotDeviceController],
      providers: [IotDeviceService],
    }).compile();

    controller = module.get<IotDeviceController>(IotDeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
