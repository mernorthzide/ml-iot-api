import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleGasConsumption } from './entities/example-gas-consumption.entity';
import { ExampleGasConsumptionController } from './example-gas-consumption.controller';
import { ExampleGasConsumptionGateway } from './example-gas-consumption.gateway';
import { ExampleGasConsumptionService } from './example-gas-consumption.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExampleGasConsumption])],
  controllers: [ExampleGasConsumptionController],
  providers: [ExampleGasConsumptionService, ExampleGasConsumptionGateway],
  exports: [ExampleGasConsumptionService],
})
export class ExampleGasConsumptionModule {}
