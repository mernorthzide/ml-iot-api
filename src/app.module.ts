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
import { IotDeviceTypeModule } from './iot-device-type/iot-device-type.module';
import { LocationModule } from './location/location.module';
import { IotDeviceModule } from './iot-device/iot-device.module';
import { IotDeviceModelModule } from './iot-device-model/iot-device-model.module';
import { IotDeviceScheduleModule } from './iot-device-schedule/iot-device-schedule.module';
import { PocModbusModule } from './poc-modbus/poc-modbus.module';
import { SchneiderPm2200DataModule } from './schneider-pm2200-data/schneider-pm2200-data.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SchneiderPm2200HourlyModule } from './schneider-pm2200-hourly/schneider-pm2200-hourly.module';
import { DashboardConfigModule } from './dashboard-config/dashboard-config.module';

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
    // ExampleModule,
    // ExampleGasStationModule,
    // ExampleBoilerPressureModule,
    // ExampleGasConsumptionModule,
    // ExampleLoadBoilerModule,
    IotDeviceTypeModule,
    LocationModule,
    IotDeviceModule,
    IotDeviceModelModule,
    IotDeviceScheduleModule,
    PocModbusModule,
    SchneiderPm2200DataModule,
    SchneiderPm2200HourlyModule,
    DashboardConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
