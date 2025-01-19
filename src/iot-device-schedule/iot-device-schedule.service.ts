import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Repository } from 'typeorm';
import { IotDeviceSchedule } from './entities/iot-device-schedule.entity';
import { Override } from '@dataui/crud';
import { CrudRequest, CreateManyDto } from '@dataui/crud';
import { DeepPartial } from 'typeorm';

@Injectable()
export class IotDeviceScheduleService
  extends TypeOrmCrudService<IotDeviceSchedule>
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private scheduleIntervals: Map<number, NodeJS.Timeout> = new Map();

  constructor(
    @InjectRepository(IotDeviceSchedule)
    private readonly iotDeviceScheduleRepository: Repository<IotDeviceSchedule>,
  ) {
    super(iotDeviceScheduleRepository);
  }

  // Override methods จาก TypeOrmCrudService
  @Override()
  async createOne(
    req: CrudRequest,
    dto: Partial<IotDeviceSchedule>,
  ): Promise<IotDeviceSchedule> {
    const result = await super.createOne(req, dto);
    await this.updateDeviceSchedule(result.id);
    return result;
  }

  @Override()
  async createMany(
    req: CrudRequest,
    dto: CreateManyDto<DeepPartial<IotDeviceSchedule>>,
  ): Promise<IotDeviceSchedule[]> {
    const results = await super.createMany(req, dto);
    for (const result of results) {
      await this.updateDeviceSchedule(result.id);
    }
    return results;
  }

  @Override()
  async updateOne(
    req: CrudRequest,
    dto: Partial<IotDeviceSchedule>,
  ): Promise<IotDeviceSchedule> {
    const result = await super.updateOne(req, dto);
    await this.updateDeviceSchedule(result.id);
    return result;
  }

  @Override()
  async replaceOne(
    req: CrudRequest,
    dto: Partial<IotDeviceSchedule>,
  ): Promise<IotDeviceSchedule> {
    const result = await super.replaceOne(req, dto);
    await this.updateDeviceSchedule(result.id);
    return result;
  }

  // เริ่มทำงานอัตโนมัติเมื่อแอพพลิเคชั่นเริ่มต้น
  async onApplicationBootstrap() {
    console.log('Starting device schedules...');
    await this.setupSchedules();
  }

  // ทำความสะอาด schedules เมื่อแอพพลิเคชั่นปิด
  onApplicationShutdown() {
    console.log('Cleaning up device schedules...');
    for (const interval of this.scheduleIntervals.values()) {
      clearInterval(interval);
    }
    this.scheduleIntervals.clear();
  }

  async setupSchedules() {
    try {
      // 1. ดึงค่า Device types ทั้งหมด
      const deviceTypes = await this.iotDeviceScheduleRepository
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.iot_device_type', 'deviceType')
        .getMany();

      // 2. สร้าง schedules สำหรับแต่ละ device type
      deviceTypes.forEach((deviceSchedule) => {
        this.createScheduleForDevice(deviceSchedule);
      });

      console.log(`Successfully setup ${deviceTypes.length} device schedules`);
    } catch (error) {
      console.error('Error setting up schedules:', error);
    }
  }

  // สร้าง schedule สำหรับ device เฉพาะ
  private createScheduleForDevice(deviceSchedule: IotDeviceSchedule) {
    // ยกเลิก schedule เดิมถ้ามี
    if (this.scheduleIntervals.has(deviceSchedule.id)) {
      clearInterval(this.scheduleIntervals.get(deviceSchedule.id));
    }

    const interval = deviceSchedule.schedule_interval;

    // สร้าง schedule ใหม่
    const intervalId = setInterval(() => {
      console.log(
        `[${new Date().toISOString()}] Running schedule for device type: ${deviceSchedule.iot_device_type.name}`,
      );
      console.log(`Interval: ${interval}`);
      // TODO: เพิ่มการทำงานเพิ่มเติมตามต้องการ
    }, this.parseInterval(interval));

    // เก็บ reference ของ interval ใหม่
    this.scheduleIntervals.set(deviceSchedule.id, intervalId);
  }

  // อัพเดท schedule เมื่อมีการเปลี่ยนแปลง
  async updateDeviceSchedule(scheduleId: number) {
    try {
      // ดึงข้อมูล schedule ที่อัพเดท
      const updatedSchedule = await this.iotDeviceScheduleRepository
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.iot_device_type', 'deviceType')
        .where('schedule.id = :id', { id: scheduleId })
        .getOne();

      if (updatedSchedule) {
        console.log(
          `Updating schedule for device type: ${updatedSchedule.iot_device_type.name}`,
        );
        this.createScheduleForDevice(updatedSchedule);
      }
    } catch (error) {
      console.error(`Error updating schedule ${scheduleId}:`, error);
    }
  }

  // ฟังก์ชันสำหรับรีสตาร์ท schedules ทั้งหมด
  async restartSchedules() {
    console.log('Restarting all schedules...');
    this.onApplicationShutdown();
    await this.setupSchedules();
  }

  private parseInterval(interval: string): number {
    // แปลง interval string เป็น milliseconds
    const value = parseInt(interval);
    const unit = interval.replace(/[0-9]/g, '').toLowerCase();

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      default:
        return value * 1000; // default เป็นวินาที
    }
  }
}
