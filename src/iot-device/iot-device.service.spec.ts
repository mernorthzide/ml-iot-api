import { Test, TestingModule } from '@nestjs/testing';
import { IotDeviceService } from './iot-device.service';

describe('IotDeviceService', () => {
  let service: IotDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IotDeviceService],
    }).compile();

    service = module.get<IotDeviceService>(IotDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
