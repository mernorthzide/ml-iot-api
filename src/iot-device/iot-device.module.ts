import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotDeviceController } from './iot-device.controller';
import { IotDeviceService } from './iot-device.service';
import { IotDevice } from './entities/iot-device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IotDevice])],
  controllers: [IotDeviceController],
  providers: [IotDeviceService],
})
export class IotDeviceModule {}
