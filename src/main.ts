import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   cors({
  //     origin: true,
  //     credentials: true,
  //   }),
  // );
  // app.use(
  //   cors({
  //     origin: 'http://localhost:3000/',
  //   }),
  // );
  app.use(express.json());
  app.use('/graphql', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000/');
    // res.send(data);
  });
  // app.enableCors({
  //   origin: '*',
  // });
  // app.enableCors({
  //   origin: ['http://localhost:3000/', 'http://34.64.102.157:3000/graphql'],
  //   credentials: true,
  // });
  await app.listen(3000);
}
bootstrap();
