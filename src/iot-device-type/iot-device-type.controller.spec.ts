import { Test, TestingModule } from '@nestjs/testing';
import { IotDeviceTypeController } from './iot-device-type.controller';
import { IotDeviceTypeService } from './iot-device-type.service';

describe('IotDeviceTypeController', () => {
  let controller: IotDeviceTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IotDeviceTypeController],
      providers: [IotDeviceTypeService],
    }).compile();

    controller = module.get<IotDeviceTypeController>(IotDeviceTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
