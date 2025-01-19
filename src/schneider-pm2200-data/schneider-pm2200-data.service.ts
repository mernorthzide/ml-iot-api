import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { SchneiderPm2200Data } from './entities/schneider-pm2200-data.entity';
import { Repository } from 'typeorm';
import { SchneiderPm2200DataGateway } from './schneider-pm2200-data.gateway';

@Injectable()
export class SchneiderPm2200DataService extends TypeOrmCrudService<SchneiderPm2200Data> {
  constructor(
    @InjectRepository(SchneiderPm2200Data)
    private readonly schneiderPm2200DataRepository: Repository<SchneiderPm2200Data>,
    private readonly schneiderPm2200DataGateway: SchneiderPm2200DataGateway,
  ) {
    super(schneiderPm2200DataRepository);
  }

  async saveSchneiderPM2200Data(
    data: any,
    iotDeviceId: number,
  ): Promise<SchneiderPm2200Data> {
    const schneiderData = new SchneiderPm2200Data();
    schneiderData.iot_device_id = iotDeviceId;
    schneiderData.active_energy_delivered_into_load_2700 =
      data.active_energy_delivered_into_load_2700;
    schneiderData.current_a_3000 = data.current_a_3000;
    schneiderData.current_b_3002 = data.current_b_3002;
    schneiderData.current_c_3004 = data.current_c_3004;
    schneiderData.current_n_3006 = data.current_n_3006;
    schneiderData.current_average_3010 = data.current_average_3010;
    schneiderData.voltage_a_b_3020 = data.voltage_a_b_3020;
    schneiderData.voltage_b_c_3022 = data.voltage_b_c_3022;
    schneiderData.voltage_c_a_3024 = data.voltage_c_a_3024;
    schneiderData.voltage_l_l_avg_3026 = data.voltage_l_l_avg_3026;
    schneiderData.voltage_a_n_3028 = data.voltage_a_n_3028;
    schneiderData.voltage_b_n_3030 = data.voltage_b_n_3030;
    schneiderData.voltage_c_n_3032 = data.voltage_c_n_3032;
    schneiderData.voltage_l_n_average_3036 = data.voltage_l_n_average_3036;
    schneiderData.active_power_a_3054 = data.active_power_a_3054;
    schneiderData.active_power_b_3056 = data.active_power_b_3056;
    schneiderData.active_power_c_3058 = data.active_power_c_3058;
    schneiderData.active_power_total_3060 = data.active_power_total_3060;
    schneiderData.power_factor_total_3084 = data.power_factor_total_3084;

    const savedData =
      await this.schneiderPm2200DataRepository.save(schneiderData);

    // ส่งข้อมูลผ่าน WebSocket
    this.schneiderPm2200DataGateway.sendSchneiderPM2200Update(savedData);

    return savedData;
  }
}
