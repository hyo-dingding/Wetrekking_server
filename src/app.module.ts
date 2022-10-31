import { Module } from '@nestjs/common';
import { CrewBoardModule } from './apis/crewBoard/crewBoard.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CrewBoardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
