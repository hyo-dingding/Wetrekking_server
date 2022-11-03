import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const app1 = express();
  // app1.use(cors());
  app.use(
    cors({
      origin: 'http://localhost:3000/',
    }),
  );
  app1.use(express.json());
  await app.listen(3000);
}
bootstrap();
