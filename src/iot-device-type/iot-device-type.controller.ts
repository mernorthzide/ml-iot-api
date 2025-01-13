import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IotDeviceTypeService } from './iot-device-type.service';
import { IotDeviceType } from './entities/iot-device-type.entity';

@Crud({
  model: {
    type: IotDeviceType,
  },
  query: {
    join: {
      created_by: {},
      updated_by: {},
    },
  },
})
@ApiTags('IoT Device Type')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('iot-device-type')
export class IotDeviceTypeController implements CrudController<IotDeviceType> {
  constructor(public service: IotDeviceTypeService) {}

  get base(): CrudController<IotDeviceType> {
    return this;
  }
}
