import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardConfig } from './entities/dashboard-config.entity';

@Injectable()
export class DashboardConfigService extends TypeOrmCrudService<DashboardConfig> {
  constructor(
    @InjectRepository(DashboardConfig)
    repo: Repository<DashboardConfig>,
  ) {
    super(repo);
  }
}
