import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleLoadBoiler } from './entities/example-load-boiler.entity';
import { ExampleLoadBoilerController } from './example-load-boiler.controller';
import { ExampleLoadBoilerGateway } from './example-load-boiler.gateway';
import { ExampleLoadBoilerService } from './example-load-boiler.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExampleLoadBoiler])],
  controllers: [ExampleLoadBoilerController],
  providers: [ExampleLoadBoilerService, ExampleLoadBoilerGateway],
  exports: [ExampleLoadBoilerService],
})
export class ExampleLoadBoilerModule {}
