import { Crud, CrudController } from '@dataui/crud';
import {
  Controller,
  UseGuards,
  Post,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { IotDeviceService } from './iot-device.service';
import { IotDevice } from './entities/iot-device.entity';
import ModbusRTU from 'modbus-serial';
import {
  TestConnectionDto,
  PM2200_REGISTERS,
  DeviceReadings,
} from './dto/test-connection.dto';

@Crud({
  model: {
    type: IotDevice,
  },
  query: {
    join: {
      created_by: {},
      updated_by: {},
      iot_device_type: {},
      iot_device_model: {},
      location: {},
    },
  },
})
@ApiTags('IoT Device')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('iot-device')
export class IotDeviceController implements CrudController<IotDevice> {
  constructor(public service: IotDeviceService) {}

  get base(): CrudController<IotDevice> {
    return this;
  }

  @Post('test-connection')
  @ApiOperation({ summary: 'Test connection to IoT device' })
  @ApiResponse({ status: 200, description: 'Connection successful' })
  @ApiResponse({ status: 400, description: 'Connection failed' })
  async testConnection(@Body() testConnectionDto: TestConnectionDto) {
    try {
      const client = new ModbusRTU();
      await client.connectTCP(testConnectionDto.ip, {
        port: testConnectionDto.port,
      });

      // ตั้งค่า ID ของอุปกรณ์
      client.setID(testConnectionDto.device_id);

      const readings: DeviceReadings = {};

      // ฟังก์ชันสำหรับอ่านค่าแบบ safe
      const safeReadRegister = async (
        register: number,
      ): Promise<number | null> => {
        try {
          const result = await client.readHoldingRegisters(register, 2);
          return this.parseFloat32(result.data);
        } catch (error) {
          console.log(`Cannot read register ${register}`);
          return null;
        }
      };

      // อ่านค่าพลังงาน
      readings.active_energy_delivered_into_load = await safeReadRegister(
        PM2200_REGISTERS.ACTIVE_ENERGY.DELIVERED_INTO_LOAD,
      );

      // อ่านค่ากระแสไฟฟ้า
      readings.current = {
        a: await safeReadRegister(PM2200_REGISTERS.CURRENT.A),
        b: await safeReadRegister(PM2200_REGISTERS.CURRENT.B),
        c: await safeReadRegister(PM2200_REGISTERS.CURRENT.C),
        n: await safeReadRegister(PM2200_REGISTERS.CURRENT.N),
        average: await safeReadRegister(PM2200_REGISTERS.CURRENT.AVERAGE),
      };

      // อ่านค่าแรงดันไฟฟ้า
      readings.voltage = {
        a_b: await safeReadRegister(PM2200_REGISTERS.VOLTAGE.A_B),
        b_c: await safeReadRegister(PM2200_REGISTERS.VOLTAGE.B_C),
        c_a: await safeReadRegister(PM2200_REGISTERS.VOLTAGE.C_A),
        l_l_avg: await safeReadRegister(PM2200_REGISTERS.VOLTAGE.L_L_AVG),
        a_n: await safeReadRegister(PM2200_REGISTERS.VOLTAGE.A_N),
        b_n: await safeReadRegister(PM2200_REGISTERS.VOLTAGE.B_N),
        c_n: await safeReadRegister(PM2200_REGISTERS.VOLTAGE.C_N),
        l_n_avg: await safeReadRegister(PM2200_REGISTERS.VOLTAGE.L_N_AVG),
      };

      // อ่านค่ากำลังไฟฟ้า
      readings.active_power = {
        a: await safeReadRegister(PM2200_REGISTERS.ACTIVE_POWER.A),
        b: await safeReadRegister(PM2200_REGISTERS.ACTIVE_POWER.B),
        c: await safeReadRegister(PM2200_REGISTERS.ACTIVE_POWER.C),
        total: await safeReadRegister(PM2200_REGISTERS.ACTIVE_POWER.TOTAL),
      };

      // อ่านค่า Power Factor
      readings.power_factor = {
        total: await safeReadRegister(PM2200_REGISTERS.POWER_FACTOR.TOTAL),
      };

      await client.close(() => {});

      return {
        success: true,
        message: 'Successfully connected to device',
        device: {
          id: testConnectionDto.device_id,
          ip: testConnectionDto.ip,
          port: testConnectionDto.port,
        },
        readings,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to connect to device',
          error: error.message,
          device: {
            id: testConnectionDto.device_id,
            ip: testConnectionDto.ip,
            port: testConnectionDto.port,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private parseFloat32(data: number[]): number {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt16BE(data[0], 0);
    buffer.writeUInt16BE(data[1], 2);
    return buffer.readFloatBE(0);
  }
}
