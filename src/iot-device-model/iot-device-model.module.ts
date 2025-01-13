import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotDeviceModelController } from './iot-device-model.controller';
import { IotDeviceModelService } from './iot-device-model.service';
import { IotDeviceModel } from './entities/iot-device-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IotDeviceModel])],
  controllers: [IotDeviceModelController],
  providers: [IotDeviceModelService],
})
export class IotDeviceModelModule {}
