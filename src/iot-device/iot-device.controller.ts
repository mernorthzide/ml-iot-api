import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IotDeviceService } from './iot-device.service';
import { IotDevice } from './entities/iot-device.entity';

@Crud({
  model: {
    type: IotDevice,
  },
  query: {
    join: {
      created_by: {
        eager: true,
      },
      updated_by: {
        eager: true,
      },
      iot_device_type: {
        eager: true,
      },
      location: {
        eager: true,
      },
    },
  },
})
@ApiTags('IoT Device')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('iot-device')
export class IotDeviceController implements CrudController<IotDevice> {
  constructor(public service: IotDeviceService) {}

  get base(): CrudController<IotDevice> {
    return this;
  }
}
