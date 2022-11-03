import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cors());
  app.use(express.json());
  // app.enableCors({
  //   origin: 'http://localhost:3000/',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress());
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Authorization',
      'X-Requested-With',
      'Content-Type',
      'Accept',
    ],
    credentials: true,
    origin: ['http://localhost:3000', 'https://wetrekking.kr'],
    exposedHeaders: ['Authorization', 'Set-Cookie', 'Cookie'],
  });
  // app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(3000);
}
bootstrap();
