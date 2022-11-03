import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(
    cors({
      origin: 'http://localhost:3000/',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    }),
  );
  app.use(express.json());
  app.enableCors({
    origin: 'http://localhost:3000/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
