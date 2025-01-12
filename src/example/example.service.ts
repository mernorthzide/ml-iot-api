import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Example } from './entities/example.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExampleService extends TypeOrmCrudService<Example> {
  constructor(
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
  ) {
    super(exampleRepository);
  }
}
