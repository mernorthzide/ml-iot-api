import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ExampleGasStation } from './entities/example-gas-station.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExampleGasStationGateway } from './example-gas-station.gateway';

@Injectable()
export class ExampleGasStationService extends TypeOrmCrudService<ExampleGasStation> {
  constructor(
    @InjectRepository(ExampleGasStation)
    private readonly exampleGasStationRepository: Repository<ExampleGasStation>,
    private readonly gasStationGateway: ExampleGasStationGateway,
  ) {
    super(exampleGasStationRepository);
  }

  private previousBarLeft = 7;
  private previousBarRight = 7;

  @Cron('*/1 * * * * *')
  async insertRandomData() {
    const newData = new ExampleGasStation();

    this.previousBarLeft += Math.random() < 0.5 ? -1 : 1;
    this.previousBarLeft = Math.min(15, Math.max(0, this.previousBarLeft));

    this.previousBarRight += Math.random() < 0.5 ? -1 : 1;
    this.previousBarRight = Math.min(15, Math.max(0, this.previousBarRight));

    newData.bar_left = this.previousBarLeft;
    newData.bar_right = this.previousBarRight;

    const savedData = await this.exampleGasStationRepository.save(newData);
    this.gasStationGateway.sendUpdate(savedData);
  }

  async getLatestData() {
    return await this.exampleGasStationRepository.findOne({
      order: { created_at: 'DESC' },
    });
  }
}
