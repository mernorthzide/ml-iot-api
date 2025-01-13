import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Repository } from 'typeorm';
import { IotDeviceType } from './entities/iot-device-type.entity';

@Injectable()
export class IotDeviceTypeService extends TypeOrmCrudService<IotDeviceType> {
  constructor(
    @InjectRepository(IotDeviceType)
    private readonly iotDeviceTypeRepository: Repository<IotDeviceType>,
  ) {
    super(iotDeviceTypeRepository);
  }
}
