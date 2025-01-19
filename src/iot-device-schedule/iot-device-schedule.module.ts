import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotDeviceScheduleController } from './iot-device-schedule.controller';
import { IotDeviceScheduleService } from './iot-device-schedule.service';
import { IotDeviceSchedule } from './entities/iot-device-schedule.entity';
import { IotDevice } from '../iot-device/entities/iot-device.entity';
import { SchneiderPm2200DataModule } from '../schneider-pm2200-data/schneider-pm2200-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IotDeviceSchedule, IotDevice]),
    SchneiderPm2200DataModule,
  ],
  controllers: [IotDeviceScheduleController],
  providers: [IotDeviceScheduleService],
})
export class IotDeviceScheduleModule {}
