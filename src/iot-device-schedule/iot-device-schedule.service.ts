import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Repository } from 'typeorm';
import { IotDeviceSchedule } from './entities/iot-device-schedule.entity';

@Injectable()
export class IotDeviceScheduleService extends TypeOrmCrudService<IotDeviceSchedule> {
  constructor(
    @InjectRepository(IotDeviceSchedule)
    private readonly iotDeviceScheduleRepository: Repository<IotDeviceSchedule>,
  ) {
    super(iotDeviceScheduleRepository);
  }
}
