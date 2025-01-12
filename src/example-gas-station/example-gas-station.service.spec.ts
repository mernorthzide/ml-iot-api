import { Test, TestingModule } from '@nestjs/testing';
import { ExampleGasStationService } from './example-gas-station.service';

describe('ExampleGasStationService', () => {
  let service: ExampleGasStationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExampleGasStationService],
    }).compile();

    service = module.get<ExampleGasStationService>(ExampleGasStationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
