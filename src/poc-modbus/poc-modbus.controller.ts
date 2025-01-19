import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PocModbusService } from './poc-modbus.service';
import { ModbusConnectionDto } from './dto/modbus-connection.dto';

@Controller('poc-modbus')
export class PocModbusController {
  constructor(private readonly pocModbusService: PocModbusService) {}

  @Post('read-data')
  readModbusData(@Body() modbusConnectionDto: ModbusConnectionDto) {
    return this.pocModbusService.readModbusData(modbusConnectionDto);
  }
}
