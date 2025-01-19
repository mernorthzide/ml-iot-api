import { Injectable } from '@nestjs/common';
import { ModbusConnectionDto } from './dto/modbus-connection.dto';
import ModbusRTU from 'modbus-serial';

const REGISTERS = {
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
export class PocModbusService {
  async readModbusData(modbusConnectionDto: ModbusConnectionDto) {
    try {
      const client = new ModbusRTU();
      await client.connectTCP(modbusConnectionDto.ip, {
        port: modbusConnectionDto.port,
      });

      // อ่านค่า Active Power Total
      const activePowerResult = await client.readHoldingRegisters(
        REGISTERS.ACTIVE_POWER.TOTAL,
        2,
      );
      const powerBuffer = Buffer.alloc(4);
      powerBuffer.writeUInt16BE(activePowerResult.data[0], 0);
      powerBuffer.writeUInt16BE(activePowerResult.data[1], 2);
      const powerValue = powerBuffer.readFloatBE(0);

      // อ่านค่าพลังงาน
      const energyDelivered = await client.readHoldingRegisters(
        REGISTERS.ACTIVE_ENERGY.DELIVERED,
        2,
      );
      const energyReceived = await client.readHoldingRegisters(
        REGISTERS.ACTIVE_ENERGY.RECEIVED,
        2,
      );
      const energyDeliveredReceived = await client.readHoldingRegisters(
        REGISTERS.ACTIVE_ENERGY.DELIVERED_RECEIVED,
        2,
      );
      const energyDeliveredMinusReceived = await client.readHoldingRegisters(
        REGISTERS.ACTIVE_ENERGY.DELIVERED_MINUS_RECEIVED,
        2,
      );

      // อ่านค่ากระแสไฟฟ้า
      const currentA = await client.readHoldingRegisters(
        REGISTERS.CURRENT.A,
        2,
      );
      const currentB = await client.readHoldingRegisters(
        REGISTERS.CURRENT.B,
        2,
      );
      const currentC = await client.readHoldingRegisters(
        REGISTERS.CURRENT.C,
        2,
      );
      const currentN = await client.readHoldingRegisters(
        REGISTERS.CURRENT.N,
        2,
      );
      const currentG = await client.readHoldingRegisters(
        REGISTERS.CURRENT.G,
        2,
      );
      const currentAvg = await client.readHoldingRegisters(
        REGISTERS.CURRENT.AVG,
        2,
      );

      // อ่านค่าแรงดันไฟฟ้า
      const voltageAB = await client.readHoldingRegisters(
        REGISTERS.VOLTAGE.A_B,
        2,
      );
      const voltageBC = await client.readHoldingRegisters(
        REGISTERS.VOLTAGE.B_C,
        2,
      );
      const voltageCA = await client.readHoldingRegisters(
        REGISTERS.VOLTAGE.C_A,
        2,
      );
      const voltageLLAvg = await client.readHoldingRegisters(
        REGISTERS.VOLTAGE.L_L_AVG,
        2,
      );
      const voltageAN = await client.readHoldingRegisters(
        REGISTERS.VOLTAGE.A_N,
        2,
      );
      const voltageBN = await client.readHoldingRegisters(
        REGISTERS.VOLTAGE.B_N,
        2,
      );
      const voltageCN = await client.readHoldingRegisters(
        REGISTERS.VOLTAGE.C_N,
        2,
      );
      const voltageLNAvg = await client.readHoldingRegisters(
        REGISTERS.VOLTAGE.L_N_AVG,
        2,
      );

      // แปลงค่าต่างๆ
      const energyData = {
        delivered: this.parseFloat32(energyDelivered.data),
        received: this.parseFloat32(energyReceived.data),
        deliveredReceived: this.parseFloat32(energyDeliveredReceived.data),
        deliveredMinusReceived: this.parseFloat32(
          energyDeliveredMinusReceived.data,
        ),
      };

      const currentData = {
        a: this.parseFloat32(currentA.data),
        b: this.parseFloat32(currentB.data),
        c: this.parseFloat32(currentC.data),
        n: this.parseFloat32(currentN.data),
        g: this.parseFloat32(currentG.data),
        avg: this.parseFloat32(currentAvg.data),
      };

      const voltageData = {
        ab: this.parseFloat32(voltageAB.data),
        bc: this.parseFloat32(voltageBC.data),
        ca: this.parseFloat32(voltageCA.data),
        llAvg: this.parseFloat32(voltageLLAvg.data),
        an: this.parseFloat32(voltageAN.data),
        bn: this.parseFloat32(voltageBN.data),
        cn: this.parseFloat32(voltageCN.data),
        lnAvg: this.parseFloat32(voltageLNAvg.data),
      };

      const powerData = {
        value: powerValue,
        AB: activePowerResult.data[0]
          .toString(16)
          .padStart(4, '0')
          .toUpperCase(),
        CD: activePowerResult.data[1]
          .toString(16)
          .padStart(4, '0')
          .toUpperCase(),
      };

      await client.close(() => {});

      return {
        success: true,
        data: {
          power: powerData,
          energy: energyData,
          current: currentData,
          voltage: voltageData,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private parseFloat32(data: number[]) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt16BE(data[0], 0);
    buffer.writeUInt16BE(data[1], 2);
    return buffer.readFloatBE(0);
  }
}
