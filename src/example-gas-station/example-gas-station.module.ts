import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleGasStationController } from './example-gas-station.controller';
import { ExampleGasStationService } from './example-gas-station.service';
import { ExampleGasStation } from './entities/example-gas-station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExampleGasStation])],
  controllers: [ExampleGasStationController],
  providers: [ExampleGasStationService],
})
export class ExampleGasStationModule {}
