import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { SchneiderPm2200Hourly } from './entities/schneider-pm2200-hourly.entity';
import { Repository } from 'typeorm';
import { SchneiderPm2200HourlyGateway } from './schneider-pm2200-hourly.gateway';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SchneiderPm2200HourlyService
  extends TypeOrmCrudService<SchneiderPm2200Hourly>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(SchneiderPm2200Hourly)
    private readonly schneiderPm2200HourlyRepository: Repository<SchneiderPm2200Hourly>,
    private readonly schneiderPm2200HourlyGateway: SchneiderPm2200HourlyGateway,
  ) {
    super(schneiderPm2200HourlyRepository);
  }

  // เรียกใช้เมื่อ Module เริ่มทำงาน
  async onModuleInit() {
    console.log('Checking and calculating averages on module init...');
    await this.calculateLastTwoHoursAverages();
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

    // ส่งข้อมูลผ่าน WebSocket
    this.schneiderPm2200HourlyGateway.sendSchneiderPM2200HourlyUpdate(
      savedData,
    );

    // ตรวจสอบและคำนวณค่าเฉลี่ยทันทีหลังจากบันทึกข้อมูลใหม่
    await this.calculateLastTwoHoursAverages();

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

  @Cron('0 0 * * * *') // ทำงานทุกต้นชั่วโมง
  async calculatePreviousHourAverages() {
    try {
      // คำนวณช่วงเวลาสำหรับชั่วโมงที่แล้ว
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      await this.processDeviceHourlyAverages(oneHourAgo, now);
    } catch (error) {
      console.error('Error calculating previous hour averages:', error);
    }
  }

  // ฟังก์ชันสำหรับตรวจสอบและคำนวณค่าเฉลี่ยของ 2 ชั่วโมงล่าสุด
  async calculateLastTwoHoursAverages() {
    try {
      const now = new Date();
      const currentHourStart = new Date(now);
      currentHourStart.setMinutes(0, 0, 0);

      const previousHourStart = new Date(currentHourStart);
      previousHourStart.setHours(previousHourStart.getHours() - 1);

      // ตรวจสอบข้อมูลชั่วโมงปัจจุบัน
      const currentHourData = await this.schneiderPm2200HourlyRepository
        .createQueryBuilder('data')
        .where('data.created_at >= :currentHourStart', { currentHourStart })
        .andWhere('data.created_at < :now', { now })
        .getCount();

      // ตรวจสอบข้อมูลชั่วโมงก่อนหน้า
      const previousHourData = await this.schneiderPm2200HourlyRepository
        .createQueryBuilder('data')
        .where('data.created_at >= :previousHourStart', { previousHourStart })
        .andWhere('data.created_at < :currentHourStart', { currentHourStart })
        .getCount();

      // คำนวณข้อมูลชั่วโมงปัจจุบันถ้ายังไม่มี
      if (currentHourData === 0) {
        console.log(
          'No data found for current hour, calculating averages now...',
        );
        await this.processDeviceHourlyAverages(currentHourStart, now);
      }

      // คำนวณข้อมูลชั่วโมงก่อนหน้าถ้ายังไม่มี
      if (previousHourData === 0) {
        console.log(
          'No data found for previous hour, calculating averages now...',
        );
        await this.processDeviceHourlyAverages(
          previousHourStart,
          currentHourStart,
        );
      }
    } catch (error) {
      console.error('Error checking and calculating hourly averages:', error);
    }
  }

  // ฟังก์ชันสำหรับประมวลผลค่าเฉลี่ยของแต่ละอุปกรณ์
  private async processDeviceHourlyAverages(startTime: Date, endTime: Date) {
    const hourlyData = await this.schneiderPm2200HourlyRepository
      .createQueryBuilder('data')
      .select([
        'data.iot_device_id',
        'AVG(data.active_energy_delivered_into_load_2700) as avg_active_energy_delivered',
        'AVG(data.current_a_3000) as avg_current_a',
        'AVG(data.current_b_3002) as avg_current_b',
        'AVG(data.current_c_3004) as avg_current_c',
        'AVG(data.current_n_3006) as avg_current_n',
        'AVG(data.current_average_3010) as avg_current_average',
        'AVG(data.voltage_a_b_3020) as avg_voltage_a_b',
        'AVG(data.voltage_b_c_3022) as avg_voltage_b_c',
        'AVG(data.voltage_c_a_3024) as avg_voltage_c_a',
        'AVG(data.voltage_l_l_avg_3026) as avg_voltage_l_l',
        'AVG(data.voltage_a_n_3028) as avg_voltage_a_n',
        'AVG(data.voltage_b_n_3030) as avg_voltage_b_n',
        'AVG(data.voltage_c_n_3032) as avg_voltage_c_n',
        'AVG(data.voltage_l_n_average_3036) as avg_voltage_l_n',
        'AVG(data.active_power_a_3054) as avg_active_power_a',
        'AVG(data.active_power_b_3056) as avg_active_power_b',
        'AVG(data.active_power_c_3058) as avg_active_power_c',
        'AVG(data.active_power_total_3060) as avg_active_power_total',
        'AVG(data.power_factor_total_3084) as avg_power_factor_total',
      ])
      .where('data.created_at >= :startTime', { startTime })
      .andWhere('data.created_at < :endTime', { endTime })
      .groupBy('data.iot_device_id')
      .getRawMany();

    // บันทึกข้อมูลค่าเฉลี่ยและส่งผ่าน WebSocket
    for (const deviceData of hourlyData) {
      const averageData = {
        iot_device_id: deviceData.iot_device_id,
        active_energy_delivered_into_load_2700:
          deviceData.avg_active_energy_delivered,
        current_a_3000: deviceData.avg_current_a,
        current_b_3002: deviceData.avg_current_b,
        current_c_3004: deviceData.avg_current_c,
        current_n_3006: deviceData.avg_current_n,
        current_average_3010: deviceData.avg_current_average,
        voltage_a_b_3020: deviceData.avg_voltage_a_b,
        voltage_b_c_3022: deviceData.avg_voltage_b_c,
        voltage_c_a_3024: deviceData.avg_voltage_c_a,
        voltage_l_l_avg_3026: deviceData.avg_voltage_l_l,
        voltage_a_n_3028: deviceData.avg_voltage_a_n,
        voltage_b_n_3030: deviceData.avg_voltage_b_n,
        voltage_c_n_3032: deviceData.avg_voltage_c_n,
        voltage_l_n_average_3036: deviceData.avg_voltage_l_n,
        active_power_a_3054: deviceData.avg_active_power_a,
        active_power_b_3056: deviceData.avg_active_power_b,
        active_power_c_3058: deviceData.avg_active_power_c,
        active_power_total_3060: deviceData.avg_active_power_total,
        power_factor_total_3084: deviceData.avg_power_factor_total,
      };

      // บันทึกข้อมูลค่าเฉลี่ย
      const savedAverageData = await this.saveSchneiderPM2200HourlyData(
        averageData,
        deviceData.iot_device_id,
      );

      // ส่งข้อมูลผ่าน WebSocket
      this.schneiderPm2200HourlyGateway.sendSchneiderPM2200HourlyUpdate(
        savedAverageData,
      );
    }
  }
}
