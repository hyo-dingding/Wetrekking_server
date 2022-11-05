import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.use(cors());
  app.use(express.json());

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*'); // 모든 도메인
  //   // res.header("Access-Control-Allow-Origin", "https://example.com"); // 특정 도메인
  // });
  app.enableCors({
    origin: ['http://localhost:3000/', 'https://wetrekking.kr'],
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(3000);
}
bootstrap();
