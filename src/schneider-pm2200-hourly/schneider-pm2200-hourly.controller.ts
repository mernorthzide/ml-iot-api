import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SchneiderPm2200HourlyService } from './schneider-pm2200-hourly.service';
import { SchneiderPm2200Hourly } from './entities/schneider-pm2200-hourly.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Crud({
  model: {
    type: SchneiderPm2200Hourly,
  },
  query: {
    join: {
      iot_device: {
        eager: true,
      },
    },
  },
})
@ApiTags('Schneider PM2200 Hourly')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('schneider-pm2200-hourly')
export class SchneiderPm2200HourlyController
  implements CrudController<SchneiderPm2200Hourly>
{
  constructor(public service: SchneiderPm2200HourlyService) {}

  get base(): CrudController<SchneiderPm2200Hourly> {
    return this;
  }
}
