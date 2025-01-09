import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // สร้างการตั้งค่า Swagger
  const config = new DocumentBuilder()
    .setTitle('ML IoT API')
    .setDescription('API documentation for ML IoT project')
    .setVersion('1.0')
    .build();

  // สร้าง Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // ตั้งค่า Swagger UI
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
