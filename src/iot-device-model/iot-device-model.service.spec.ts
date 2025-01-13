import { Test, TestingModule } from '@nestjs/testing';
import { IotDeviceModelService } from './iot-device-model.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IotDeviceModel } from './entities/iot-device-model.entity';

describe('IotDeviceModelService', () => {
  let service: IotDeviceModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IotDeviceModelService,
        {
          provide: getRepositoryToken(IotDeviceModel),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<IotDeviceModelService>(IotDeviceModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
