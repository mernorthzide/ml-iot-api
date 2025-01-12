import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SeederModule } from './seeder/seeder.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { ExampleModule } from './example/example.module';
import { ExampleGasStationModule } from './example-gas-station/example-gas-station.module';
import { ExampleBoilerPressureModule } from './example-boiler-pressure/example-boiler-pressure.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNC') === 'true',
        options: {
          encrypt: configService.get('DB_ENCRYPT') === 'true',
        },
      }),
      inject: [ConfigService],
    }),
    RoleModule,
    UserModule,
    SeederModule,
    AuthModule,
    ExampleModule,
    ExampleGasStationModule,
    ExampleBoilerPressureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
