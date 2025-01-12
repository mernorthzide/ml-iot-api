import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ExampleBoilerPressure } from './entities/example-boiler-pressure.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExampleBoilerPressureGateway } from './example-boiler-pressure.gateway';

@Injectable()
export class ExampleBoilerPressureService extends TypeOrmCrudService<ExampleBoilerPressure> {
  constructor(
    @InjectRepository(ExampleBoilerPressure)
    private readonly boilerPressureRepository: Repository<ExampleBoilerPressure>,
    private readonly boilerPressureGateway: ExampleBoilerPressureGateway,
  ) {
    super(boilerPressureRepository);
  }

  private boiler1Value = 5.0;
  private boiler2Value = 4.5;
  private boiler3Value = 3.8;
  private boiler4Value = 4.0;

  @Cron('*/1 * * * * *')
  async insertRandomData() {
    const newData = new ExampleBoilerPressure();

    // สุ่มค่าแรงดันโดยให้เปลี่ยนแปลงเล็กน้อย
    this.boiler1Value += (Math.random() - 0.5) * 1;
    this.boiler2Value += (Math.random() - 0.5) * 1;
    this.boiler3Value += (Math.random() - 0.5) * 1;
    this.boiler4Value += (Math.random() - 0.5) * 1;

    // กำหนดขอบเขตค่าแรงดัน
    this.boiler1Value = Math.min(6.0, Math.max(4.0, this.boiler1Value));
    this.boiler2Value = Math.min(5.0, Math.max(4.0, this.boiler2Value));
    this.boiler3Value = Math.min(4.0, Math.max(3.5, this.boiler3Value));
    this.boiler4Value = Math.min(4.5, Math.max(3.5, this.boiler4Value));

    newData.boiler_1_ton = this.boiler1Value;
    newData.boiler_2_ton = this.boiler2Value;
    newData.boiler_3_ton = this.boiler3Value;
    newData.boiler_4_ton = this.boiler4Value;

    const savedData = await this.boilerPressureRepository.save(newData);
    this.boilerPressureGateway.sendBoilerPressureUpdate(savedData);
  }

  async getLatestData() {
    return await this.boilerPressureRepository.findOne({
      order: { created_at: 'DESC' },
    });
  }
}
