import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { SchneiderPm2200Hourly } from './entities/schneider-pm2200-hourly.entity';
import { Repository } from 'typeorm';
import { SchneiderPm2200HourlyGateway } from './schneider-pm2200-hourly.gateway';

@Injectable()
export class SchneiderPm2200HourlyService extends TypeOrmCrudService<SchneiderPm2200Hourly> {
  constructor(
    @InjectRepository(SchneiderPm2200Hourly)
    private readonly schneiderPm2200HourlyRepository: Repository<SchneiderPm2200Hourly>,
    private readonly schneiderPm2200HourlyGateway: SchneiderPm2200HourlyGateway,
  ) {
    super(schneiderPm2200HourlyRepository);
  }

  async saveSchneiderPM2200HourlyData(
    data: any,
    iotDeviceId: number,
  ): Promise<SchneiderPm2200Hourly> {
    const schneiderHourlyData = new SchneiderPm2200Hourly();
    schneiderHourlyData.iot_device_id = iotDeviceId;
    schneiderHourlyData.active_energy_delivered_into_load_2700 =
      data.active_energy_delivered_into_load_2700;
    schneiderHourlyData.current_a_3000 = data.current_a_3000;
    schneiderHourlyData.current_b_3002 = data.current_b_3002;
    schneiderHourlyData.current_c_3004 = data.current_c_3004;
    schneiderHourlyData.current_n_3006 = data.current_n_3006;
    schneiderHourlyData.current_average_3010 = data.current_average_3010;
    schneiderHourlyData.voltage_a_b_3020 = data.voltage_a_b_3020;
    schneiderHourlyData.voltage_b_c_3022 = data.voltage_b_c_3022;
    schneiderHourlyData.voltage_c_a_3024 = data.voltage_c_a_3024;
    schneiderHourlyData.voltage_l_l_avg_3026 = data.voltage_l_l_avg_3026;
    schneiderHourlyData.voltage_a_n_3028 = data.voltage_a_n_3028;
    schneiderHourlyData.voltage_b_n_3030 = data.voltage_b_n_3030;
    schneiderHourlyData.voltage_c_n_3032 = data.voltage_c_n_3032;
    schneiderHourlyData.voltage_l_n_average_3036 =
      data.voltage_l_n_average_3036;
    schneiderHourlyData.active_power_a_3054 = data.active_power_a_3054;
    schneiderHourlyData.active_power_b_3056 = data.active_power_b_3056;
    schneiderHourlyData.active_power_c_3058 = data.active_power_c_3058;
    schneiderHourlyData.active_power_total_3060 = data.active_power_total_3060;
    schneiderHourlyData.power_factor_total_3084 = data.power_factor_total_3084;

    const savedData =
      await this.schneiderPm2200HourlyRepository.save(schneiderHourlyData);

    // Send data through WebSocket
    this.schneiderPm2200HourlyGateway.sendSchneiderPM2200HourlyUpdate(
      savedData,
    );

    return savedData;
  }

  async getDailyAverageEnergyLastMonth() {
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);

    const data = await this.schneiderPm2200HourlyRepository
      .createQueryBuilder('data')
      .select([
        'DATE(data.hour_timestamp) as day',
        'AVG(data.average_active_energy) as average_energy',
      ])
      .where('data.hour_timestamp >= :lastMonth', { lastMonth })
      .andWhere('data.hour_timestamp <= :now', { now })
      .groupBy('DATE(data.hour_timestamp)')
      .orderBy('day', 'DESC')
      .getRawMany();

    return data;
  }
}
