import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotDeviceScheduleController } from './iot-device-schedule.controller';
import { IotDeviceScheduleService } from './iot-device-schedule.service';
import { IotDeviceSchedule } from './entities/iot-device-schedule.entity';
import { IotDevice } from '../iot-device/entities/iot-device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IotDeviceSchedule, IotDevice])],
  controllers: [IotDeviceScheduleController],
  providers: [IotDeviceScheduleService],
})
export class IotDeviceScheduleModule {}
