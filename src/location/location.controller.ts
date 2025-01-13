import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';

@Crud({
  model: {
    type: Location,
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
@ApiTags('Location')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('location')
export class LocationController implements CrudController<Location> {
  constructor(public service: LocationService) {}

  get base(): CrudController<Location> {
    return this;
  }
}
