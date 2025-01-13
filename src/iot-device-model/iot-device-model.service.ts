import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Repository } from 'typeorm';
import { IotDeviceModel } from './entities/iot-device-model.entity';

@Injectable()
export class IotDeviceModelService extends TypeOrmCrudService<IotDeviceModel> {
  constructor(
    @InjectRepository(IotDeviceModel)
    private readonly iotDeviceModelRepository: Repository<IotDeviceModel>,
  ) {
    super(iotDeviceModelRepository);
  }
}
