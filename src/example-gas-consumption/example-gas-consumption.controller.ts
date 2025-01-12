import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleGasConsumptionService } from './example-gas-consumption.service';
import { ExampleGasConsumption } from './entities/example-gas-consumption.entity';

@Crud({
  model: {
    type: ExampleGasConsumption,
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
@ApiTags('Example Gas Consumption')
@Controller('example-gas-consumption')
export class ExampleGasConsumptionController
  implements CrudController<ExampleGasConsumption>
{
  constructor(public service: ExampleGasConsumptionService) {}
}
