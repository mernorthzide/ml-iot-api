import { Test, TestingModule } from '@nestjs/testing';
import { ExampleGasStationController } from './example-gas-station.controller';
import { ExampleGasStationService } from './example-gas-station.service';

describe('ExampleGasStationController', () => {
  let controller: ExampleGasStationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExampleGasStationController],
      providers: [ExampleGasStationService],
    }).compile();

    controller = module.get<ExampleGasStationController>(ExampleGasStationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
