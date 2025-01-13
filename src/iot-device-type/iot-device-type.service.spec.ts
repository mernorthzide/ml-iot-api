import { Test, TestingModule } from '@nestjs/testing';
import { IotDeviceTypeService } from './iot-device-type.service';

describe('IotDeviceTypeService', () => {
  let service: IotDeviceTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IotDeviceTypeService],
    }).compile();

    service = module.get<IotDeviceTypeService>(IotDeviceTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
