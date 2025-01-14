import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotDeviceScheduleController } from './iot-device-schedule.controller';
import { IotDeviceScheduleService } from './iot-device-schedule.service';
import { IotDeviceSchedule } from './entities/iot-device-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IotDeviceSchedule])],
  controllers: [IotDeviceScheduleController],
  providers: [IotDeviceScheduleService],
})
export class IotDeviceScheduleModule {}
