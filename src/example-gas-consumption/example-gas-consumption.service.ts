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

  private stationValue = 85.0;
  private boiler1Value = 20.0;
  private boiler2Value = 15.0;
  private boiler3Value = 10.0;
  private boiler4Value = 25.0;

  @Cron('*/1 * * * * *')
  async insertRandomData() {
    const newData = new ExampleGasConsumption();

    // สุ่มค่าการใช้แก๊สโดยให้เปลี่ยนแปลงเล็กน้อย
    this.stationValue += (Math.random() - 0.5) * 5;
    this.boiler1Value += (Math.random() - 0.5) * 3;
    this.boiler2Value += (Math.random() - 0.5) * 3;
    this.boiler3Value += (Math.random() - 0.5) * 3;
    this.boiler4Value += (Math.random() - 0.5) * 3;

    // กำหนดขอบเขตค่าการใช้แก๊ส
    this.stationValue = Math.min(100.0, Math.max(80.0, this.stationValue));
    this.boiler1Value = Math.min(30.0, Math.max(10.0, this.boiler1Value));
    this.boiler2Value = Math.min(25.0, Math.max(5.0, this.boiler2Value));
    this.boiler3Value = Math.min(20.0, Math.max(5.0, this.boiler3Value));
    this.boiler4Value = Math.min(35.0, Math.max(15.0, this.boiler4Value));

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
