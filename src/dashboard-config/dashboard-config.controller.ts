import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashboardConfigService } from './dashboard-config.service';
import { DashboardConfig } from './entities/dashboard-config.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@Crud({
  model: {
    type: DashboardConfig,
  },
  query: {
    join: {
      created_by: {
        eager: true,
      },
      updated_by: {
        eager: true,
      },
    },
  },
})
@ApiTags('DashboardConfig')
@Public()
@ApiBearerAuth()
@Controller('dashboard-config')
export class DashboardConfigController
  implements CrudController<DashboardConfig>
{
  constructor(public service: DashboardConfigService) {}

  get base(): CrudController<DashboardConfig> {
    return this;
  }
}
