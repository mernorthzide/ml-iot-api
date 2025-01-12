import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleBoilerPressureService } from './example-boiler-pressure.service';
import { ExampleBoilerPressureController } from './example-boiler-pressure.controller';
import { ExampleBoilerPressure } from './entities/example-boiler-pressure.entity';
import { ExampleBoilerPressureGateway } from './example-boiler-pressure.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ExampleBoilerPressure])],
  controllers: [ExampleBoilerPressureController],
  providers: [ExampleBoilerPressureService, ExampleBoilerPressureGateway],
  exports: [ExampleBoilerPressureService],
})
export class ExampleBoilerPressureModule {}
