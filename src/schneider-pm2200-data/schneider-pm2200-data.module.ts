import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchneiderPm2200DataService } from './schneider-pm2200-data.service';
import { SchneiderPm2200DataController } from './schneider-pm2200-data.controller';
import { SchneiderPm2200Data } from './entities/schneider-pm2200-data.entity';
import { IotDevice } from '../iot-device/entities/iot-device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchneiderPm2200Data, IotDevice])],
  controllers: [SchneiderPm2200DataController],
  providers: [SchneiderPm2200DataService],
  exports: [SchneiderPm2200DataService],
})
export class SchneiderPm2200DataModule {}
