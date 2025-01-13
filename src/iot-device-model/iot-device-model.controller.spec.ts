import { Test, TestingModule } from '@nestjs/testing';
import { IotDeviceModelController } from './iot-device-model.controller';
import { IotDeviceModelService } from './iot-device-model.service';

describe('IotDeviceModelController', () => {
  let controller: IotDeviceModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IotDeviceModelController],
      providers: [
        {
          provide: IotDeviceModelService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<IotDeviceModelController>(IotDeviceModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
