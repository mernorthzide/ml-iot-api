import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotDeviceTypeController } from './iot-device-type.controller';
import { IotDeviceTypeService } from './iot-device-type.service';
import { IotDeviceType } from './entities/iot-device-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IotDeviceType])],
  controllers: [IotDeviceTypeController],
  providers: [IotDeviceTypeService],
})
export class IotDeviceTypeModule {}
