import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleService } from './example.service';
import { Example } from './entities/example.entity';

@Crud({
  model: {
    type: Example,
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
@ApiTags('Example')
@Controller('example')
export class ExampleController implements CrudController<Example> {
  constructor(public service: ExampleService) {}
}
