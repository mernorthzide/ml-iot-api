import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Repository } from 'typeorm';
import { IotDevice } from './entities/iot-device.entity';

@Injectable()
export class IotDeviceService extends TypeOrmCrudService<IotDevice> {
  constructor(
    @InjectRepository(IotDevice)
    private readonly iotDeviceRepository: Repository<IotDevice>,
  ) {
    super(iotDeviceRepository);
  }
}
