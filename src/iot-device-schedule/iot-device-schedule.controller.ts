import { Crud } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IotDeviceScheduleService } from './iot-device-schedule.service';
import { IotDeviceSchedule } from './entities/iot-device-schedule.entity';

@Crud({
  model: {
    type: IotDeviceSchedule,
  },
  query: {
    join: {
      created_by: {},
      updated_by: {},
      iot_device_type: {},
    },
  },
})
@ApiTags('IoT Device Schedule')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('iot-device-schedule')
export class IotDeviceScheduleController {
  constructor(public service: IotDeviceScheduleService) {}
}
