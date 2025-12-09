import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://finance-tracker-6d40c.web.app',
      'https://financetracker1.vercel.app',
      'https://finance-backend-4jku41zuj-godfathers-projects-80a09c32.vercel.app',
      'https://finance-backend-gvrxqjcsz-godfathers-projects-80a09c32.vercel.app',
      'https://finance-backend-3ga40smyy-godfathers-projects-80a09c32.vercel.app',
      'https://finance-backend-dmdopidv8-godfathers-projects-80a09c32.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
