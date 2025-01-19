import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SchneiderPm2200DataService } from './schneider-pm2200-data.service';
import { SchneiderPm2200Data } from './entities/schneider-pm2200-data.entity';

@Crud({
  model: {
    type: SchneiderPm2200Data,
  },
  query: {
    join: {
      iot_device: {
        eager: true,
      },
    },
  },
})
@ApiTags('Schneider PM2200 Data')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('schneider-pm2200-data')
export class SchneiderPm2200DataController
  implements CrudController<SchneiderPm2200Data>
{
  constructor(public service: SchneiderPm2200DataService) {}

  get base(): CrudController<SchneiderPm2200Data> {
    return this;
  }

  @Get('hourly-energy')
  getHourlyAverageEnergy() {
    return this.service.getHourlyAverageEnergyLast24Hours();
  }
}
