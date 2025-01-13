import { Crud } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IotDeviceModelService } from './iot-device-model.service';
import { IotDeviceModel } from './entities/iot-device-model.entity';

@Crud({
  model: {
    type: IotDeviceModel,
  },
  query: {
    join: {
      created_by: {},
      updated_by: {},
    },
  },
})
@ApiTags('IoT Device Model')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('iot-device-model')
export class IotDeviceModelController {
  constructor(public service: IotDeviceModelService) {}
}
