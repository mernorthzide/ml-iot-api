import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleGasStationService } from './example-gas-station.service';
import { ExampleGasStation } from './entities/example-gas-station.entity';

@Crud({
  model: {
    type: ExampleGasStation,
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
@ApiTags('Example Gas Station')
@Controller('example-gas-station')
export class ExampleGasStationController
  implements CrudController<ExampleGasStation>
{
  constructor(public service: ExampleGasStationService) {}
}
