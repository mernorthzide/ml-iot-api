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
import { IotDevice } from '../iot-device/entities/iot-device.entity';
import ModbusRTU from 'modbus-serial';

// Constants for Schneider PM2200 registers
const PM2200_REGISTERS = {
  ACTIVE_POWER: {
    TOTAL: 3059,
  },
  ACTIVE_ENERGY: {
    DELIVERED: 2699,
    RECEIVED: 2701,
    DELIVERED_RECEIVED: 2703,
    DELIVERED_MINUS_RECEIVED: 2705,
  },
  VOLTAGE: {
    A_B: 3019,
    B_C: 3021,
    C_A: 3023,
    L_L_AVG: 3025,
    A_N: 3027,
    B_N: 3029,
    C_N: 3031,
    L_N_AVG: 3035,
  },
  CURRENT: {
    A: 2999,
    B: 3001,
    C: 3003,
    N: 3005,
    G: 3007,
    AVG: 3009,
  },
};

@Injectable()
export class IotDeviceScheduleService
  extends TypeOrmCrudService<IotDeviceSchedule>
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private scheduleIntervals: Map<number, NodeJS.Timeout> = new Map();

  constructor(
    @InjectRepository(IotDeviceSchedule)
    private readonly iotDeviceScheduleRepository: Repository<IotDeviceSchedule>,
    @InjectRepository(IotDevice)
    private readonly iotDeviceRepository: Repository<IotDevice>,
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
        .where('schedule.is_active = :isActive', { isActive: true })
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

  private async getDevicesForType(deviceTypeId: number): Promise<IotDevice[]> {
    return this.iotDeviceRepository.find({
      where: {
        iot_device_type_id: deviceTypeId,
        is_active: true,
      },
      relations: ['iot_device_type', 'iot_device_model'],
    });
  }

  private async readSchneiderPM2200Data(device: IotDevice) {
    try {
      const client = new ModbusRTU();
      await client.connectTCP(device.ip, { port: device.port });

      // อ่านค่า Active Power Total
      const activePowerResult = await client.readHoldingRegisters(
        PM2200_REGISTERS.ACTIVE_POWER.TOTAL,
        2,
      );
      const powerBuffer = Buffer.alloc(4);
      powerBuffer.writeUInt16BE(activePowerResult.data[0], 0);
      powerBuffer.writeUInt16BE(activePowerResult.data[1], 2);
      const powerValue = powerBuffer.readFloatBE(0);

      // อ่านค่าพลังงาน
      const energyDelivered = await client.readHoldingRegisters(
        PM2200_REGISTERS.ACTIVE_ENERGY.DELIVERED,
        2,
      );
      const energyReceived = await client.readHoldingRegisters(
        PM2200_REGISTERS.ACTIVE_ENERGY.RECEIVED,
        2,
      );

      // อ่านค่ากระแสไฟฟ้า
      const currentA = await client.readHoldingRegisters(
        PM2200_REGISTERS.CURRENT.A,
        2,
      );
      const currentB = await client.readHoldingRegisters(
        PM2200_REGISTERS.CURRENT.B,
        2,
      );
      const currentC = await client.readHoldingRegisters(
        PM2200_REGISTERS.CURRENT.C,
        2,
      );

      // อ่านค่าแรงดันไฟฟ้า
      const voltageAB = await client.readHoldingRegisters(
        PM2200_REGISTERS.VOLTAGE.A_B,
        2,
      );
      const voltageBC = await client.readHoldingRegisters(
        PM2200_REGISTERS.VOLTAGE.B_C,
        2,
      );
      const voltageCA = await client.readHoldingRegisters(
        PM2200_REGISTERS.VOLTAGE.C_A,
        2,
      );

      const data = {
        power: {
          total: this.parseFloat32(activePowerResult.data),
        },
        energy: {
          delivered: this.parseFloat32(energyDelivered.data),
          received: this.parseFloat32(energyReceived.data),
        },
        current: {
          a: this.parseFloat32(currentA.data),
          b: this.parseFloat32(currentB.data),
          c: this.parseFloat32(currentC.data),
        },
        voltage: {
          ab: this.parseFloat32(voltageAB.data),
          bc: this.parseFloat32(voltageBC.data),
          ca: this.parseFloat32(voltageCA.data),
        },
      };

      await client.close(() => {});
      console.log(
        `[${new Date().toISOString()}] Device ${device.name} data:`,
        data,
      );
      return data;
    } catch (error) {
      console.error(`Error reading data from device ${device.name}:`, error);
      return null;
    }
  }

  private parseFloat32(data: number[]) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt16BE(data[0], 0);
    buffer.writeUInt16BE(data[1], 2);
    return buffer.readFloatBE(0);
  }

  private createScheduleForDevice(deviceSchedule: IotDeviceSchedule) {
    if (this.scheduleIntervals.has(deviceSchedule.id)) {
      clearInterval(this.scheduleIntervals.get(deviceSchedule.id));
      this.scheduleIntervals.delete(deviceSchedule.id);
    }

    if (!deviceSchedule.is_active) {
      console.log(
        `[${new Date().toISOString()}] Schedule for device type: ${deviceSchedule.iot_device_type.name} is inactive`,
      );
      return;
    }

    const interval = deviceSchedule.schedule_interval;

    const intervalId = setInterval(async () => {
      try {
        const devices = await this.getDevicesForType(
          deviceSchedule.iot_device_type.id,
        );

        console.log(
          `[${new Date().toISOString()}] Running schedule for device type: ${deviceSchedule.iot_device_type.name}`,
        );
        console.log(`Found ${devices.length} active devices`);
        console.log(`Schedule interval: ${interval}`);

        for (const device of devices) {
          console.log(
            `Processing device: ${device.name} (IP: ${device.ip}, Port: ${device.port})`,
          );

          // ตรวจสอบ Device Model
          if (device.iot_device_model?.name === 'Schneider PM2200') {
            await this.readSchneiderPM2200Data(device);
          } else {
            console.log(
              `Device model ${device.iot_device_model?.name} is not supported yet`,
            );
          }
        }
      } catch (error) {
        console.error(
          `Error processing schedule for device type ${deviceSchedule.iot_device_type.name}:`,
          error,
        );
      }
    }, this.parseInterval(interval));

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
