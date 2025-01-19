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
  ACTIVE_ENERGY: {
    DELIVERED_INTO_LOAD: 2699,
  },
  CURRENT: {
    A: 2999,
    B: 3001,
    C: 3003,
    N: 3004,
    AVERAGE: 3009,
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
  ACTIVE_POWER: {
    A: 3053,
    B: 3055,
    C: 3057,
    TOTAL: 3059,
  },
  POWER_FACTOR: {
    TOTAL: 3083,
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

      const data: any = {
        active_energy_delivered_into_load_2700: null,
        current_a_3000: null,
        current_b_3002: null,
        current_c_3004: null,
        current_n_3005: null,
        current_average_3010: null,
        voltage_a_b_3020: null,
        voltage_b_c_3022: null,
        voltage_c_a_3024: null,
        voltage_l_l_avg_3026: null,
        voltage_a_n_3028: null,
        voltage_b_n_3030: null,
        voltage_c_n_3032: null,
        voltage_l_n_average_3036: null,
        active_power_a_3054: null,
        active_power_b_3056: null,
        active_power_c_3058: null,
        active_power_total_3060: null,
        power_factor_total_3084: null,
      };

      // ฟังก์ชันสำหรับอ่านค่าแบบ safe
      const safeReadRegister = async (register: number, key: string) => {
        try {
          const result = await client.readHoldingRegisters(register, 2);
          data[key] = this.parseFloat32(result.data);
        } catch (error) {
          console.log(`Cannot read register ${register} for ${key}`);
        }
      };

      // อ่านค่าพลังงาน
      await safeReadRegister(
        PM2200_REGISTERS.ACTIVE_ENERGY.DELIVERED_INTO_LOAD,
        'active_energy_delivered_into_load_2700',
      );

      // อ่านค่ากระแสไฟฟ้า
      await safeReadRegister(PM2200_REGISTERS.CURRENT.A, 'current_a_3000');
      await safeReadRegister(PM2200_REGISTERS.CURRENT.B, 'current_b_3002');
      await safeReadRegister(PM2200_REGISTERS.CURRENT.C, 'current_c_3004');
      await safeReadRegister(PM2200_REGISTERS.CURRENT.N, 'current_n_3005');
      await safeReadRegister(
        PM2200_REGISTERS.CURRENT.AVERAGE,
        'current_average_3010',
      );

      // อ่านค่าแรงดันไฟฟ้า
      await safeReadRegister(PM2200_REGISTERS.VOLTAGE.A_B, 'voltage_a_b_3020');
      await safeReadRegister(PM2200_REGISTERS.VOLTAGE.B_C, 'voltage_b_c_3022');
      await safeReadRegister(PM2200_REGISTERS.VOLTAGE.C_A, 'voltage_c_a_3024');
      await safeReadRegister(
        PM2200_REGISTERS.VOLTAGE.L_L_AVG,
        'voltage_l_l_avg_3026',
      );
      await safeReadRegister(PM2200_REGISTERS.VOLTAGE.A_N, 'voltage_a_n_3028');
      await safeReadRegister(PM2200_REGISTERS.VOLTAGE.B_N, 'voltage_b_n_3030');
      await safeReadRegister(PM2200_REGISTERS.VOLTAGE.C_N, 'voltage_c_n_3032');
      await safeReadRegister(
        PM2200_REGISTERS.VOLTAGE.L_N_AVG,
        'voltage_l_n_average_3036',
      );

      // อ่านค่ากำลังไฟฟ้า
      await safeReadRegister(
        PM2200_REGISTERS.ACTIVE_POWER.A,
        'active_power_a_3054',
      );
      await safeReadRegister(
        PM2200_REGISTERS.ACTIVE_POWER.B,
        'active_power_b_3056',
      );
      await safeReadRegister(
        PM2200_REGISTERS.ACTIVE_POWER.C,
        'active_power_c_3058',
      );
      await safeReadRegister(
        PM2200_REGISTERS.ACTIVE_POWER.TOTAL,
        'active_power_total_3060',
      );

      // อ่านค่า Power Factor
      await safeReadRegister(
        PM2200_REGISTERS.POWER_FACTOR.TOTAL,
        'power_factor_total_3084',
      );

      await client.close(() => {});

      // กรองเอาเฉพาะค่าที่ไม่เป็น null
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null),
      );

      console.log(
        `[${new Date().toISOString()}] Device ${device.name} data:`,
        JSON.stringify(filteredData, null, 2),
      );
      return filteredData;
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
