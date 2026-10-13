
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิดใช้งาน ValidationPipe ทั่วทั้งแอป
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ------------------ ตั้งค่า Swagger ------------------
  const config = new DocumentBuilder()
    .setTitle('Agile Task Manager API')
    .setDescription('เอกสาร API สำหรับระบบจัดการ Task และระบบสมาชิกด้วย NestJS & Prisma')
    .setVersion('1.0')
    .addBearerAuth() // รองรับระบบ JWT Bearer Token บน Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // กำหนด Path สรุปเอกสารไปที่ http://localhost:3000/api
  // -----------------------------------------------------

  await app.listen(3000);
}
bootstrap();