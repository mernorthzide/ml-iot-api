import { Module } from '@nestjs/common';
import { PocModbusService } from './poc-modbus.service';
import { PocModbusController } from './poc-modbus.controller';

@Module({
  controllers: [PocModbusController],
  providers: [PocModbusService],
})
export class PocModbusModule {}
