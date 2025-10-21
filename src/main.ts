import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Shop Terminals Management API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен полученный при авторизации',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Аутентификация', 'Вход в систему, выход, обновление токена')
    .addTag('Администраторы', 'Управление администраторами системы (ROOT, MANAGER)')
    .addTag('Владельцы магазинов', 'Управление владельцами торговых точек')
    .addTag('Магазины', 'Управление торговыми точками')
    .addTag('Терминалы', 'Управление терминалами и их статусами')
    .addTag('Заявки', 'Управление заявками на подключение терминалов')
    .addTag('Профиль', 'Управление профилем текущего пользователя')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api\n`);
}

bootstrap();
