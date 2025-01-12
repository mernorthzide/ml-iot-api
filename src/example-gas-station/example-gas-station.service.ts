import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ExampleGasStation } from './entities/example-gas-station.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExampleGasStationService extends TypeOrmCrudService<ExampleGasStation> {
  constructor(
    @InjectRepository(ExampleGasStation)
    private readonly exampleGasStationRepository: Repository<ExampleGasStation>,
  ) {
    super(exampleGasStationRepository);
  }
}
