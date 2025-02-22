import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchneiderPm2200HourlyService } from './schneider-pm2200-hourly.service';
import { SchneiderPm2200HourlyController } from './schneider-pm2200-hourly.controller';
import { SchneiderPm2200Hourly } from './entities/schneider-pm2200-hourly.entity';
import { IotDevice } from '../iot-device/entities/iot-device.entity';
import { SchneiderPm2200HourlyGateway } from './schneider-pm2200-hourly.gateway';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchneiderPm2200Hourly, IotDevice]),
    ScheduleModule.forRoot(),
  ],
  controllers: [SchneiderPm2200HourlyController],
  providers: [SchneiderPm2200HourlyService, SchneiderPm2200HourlyGateway],
  exports: [SchneiderPm2200HourlyService],
})
export class SchneiderPm2200HourlyModule {}
