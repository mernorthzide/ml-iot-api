import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ExampleGasConsumption } from './entities/example-gas-consumption.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExampleGasConsumptionGateway } from './example-gas-consumption.gateway';

@Injectable()
export class ExampleGasConsumptionService extends TypeOrmCrudService<ExampleGasConsumption> {
  constructor(
    @InjectRepository(ExampleGasConsumption)
    private readonly gasConsumptionRepository: Repository<ExampleGasConsumption>,
    private readonly gasConsumptionGateway: ExampleGasConsumptionGateway,
  ) {
    super(gasConsumptionRepository);
  }

  private stationValue = 50;
  private boiler1Value = 50;
  private boiler2Value = 50;
  private boiler3Value = 50;
  private boiler4Value = 50;

  private getNextRandomValue(currentValue: number): number {
    const change = Math.floor(Math.random() * 21) - 10;
    let newValue = currentValue + change;

    if (newValue < 50) newValue = 50;
    if (newValue > 100) newValue = 100;

    return newValue;
  }

  @Cron('*/1 * * * * *')
  async insertRandomData() {
    const newData = new ExampleGasConsumption();

    this.stationValue = this.getNextRandomValue(this.stationValue);
    this.boiler1Value = this.getNextRandomValue(this.boiler1Value);
    this.boiler2Value = this.getNextRandomValue(this.boiler2Value);
    this.boiler3Value = this.getNextRandomValue(this.boiler3Value);
    this.boiler4Value = this.getNextRandomValue(this.boiler4Value);

    newData.station = this.stationValue;
    newData.boiler_1 = this.boiler1Value;
    newData.boiler_2 = this.boiler2Value;
    newData.boiler_3 = this.boiler3Value;
    newData.boiler_4 = this.boiler4Value;

    const savedData = await this.gasConsumptionRepository.save(newData);
    this.gasConsumptionGateway.sendGasConsumptionUpdate(savedData);
  }

  async getLatestData() {
    return await this.gasConsumptionRepository.findOne({
      order: { created_at: 'DESC' },
    });
  }
}
