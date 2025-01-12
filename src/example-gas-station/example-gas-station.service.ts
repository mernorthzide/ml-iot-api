import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ExampleGasStation } from './entities/example-gas-station.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ExampleGasStationService extends TypeOrmCrudService<ExampleGasStation> {
  constructor(
    @InjectRepository(ExampleGasStation)
    private readonly exampleGasStationRepository: Repository<ExampleGasStation>,
  ) {
    super(exampleGasStationRepository);
  }

  @Cron('*/10 * * * * *') // ทุก 10 วินาที
  async insertRandomData() {
    const newData = new ExampleGasStation();
    newData.bar_left = Math.floor(Math.random() * 16); // random 0-15
    newData.bar_right = Math.floor(Math.random() * 16); // random 0-15
    await this.exampleGasStationRepository.save(newData);
  }
}
