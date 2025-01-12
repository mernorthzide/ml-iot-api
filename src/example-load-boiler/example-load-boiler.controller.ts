import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleLoadBoilerService } from './example-load-boiler.service';
import { ExampleLoadBoiler } from './entities/example-load-boiler.entity';

@Crud({
  model: {
    type: ExampleLoadBoiler,
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
@ApiTags('Example Load Boiler')
@Controller('example-load-boiler')
export class ExampleLoadBoilerController
  implements CrudController<ExampleLoadBoiler>
{
  constructor(public service: ExampleLoadBoilerService) {}
}
