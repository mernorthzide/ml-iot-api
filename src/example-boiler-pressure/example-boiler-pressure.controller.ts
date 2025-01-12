import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleBoilerPressureService } from './example-boiler-pressure.service';
import { ExampleBoilerPressure } from './entities/example-boiler-pressure.entity';

@Crud({
  model: {
    type: ExampleBoilerPressure,
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
@ApiTags('Example Boiler Pressure')
@Controller('example-boiler-pressure')
export class ExampleBoilerPressureController
  implements CrudController<ExampleBoilerPressure>
{
  constructor(public service: ExampleBoilerPressureService) {}
}
