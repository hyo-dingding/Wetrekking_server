import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewBoardImageResolver } from '../crewBoardImages/crewBoardImage.resolver';
import { CrewBoardImageService } from '../crewBoardImages/crewBoardImage.service';
import { CrewBoardImage } from '../crewBoardImages/entities/crewBoardImage.entity';
import { User } from '../users/entities/user.entity';
import { CrewBoardResolver } from './crewBoard.resolver';
import { CrewBoardService } from './crewBoard.service';
import { CrewBoard } from './entities/crewBoard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CrewBoard, //
      CrewBoardImage,
      User,
    ]),
  ],
  providers: [
    CrewBoardResolver,
    CrewBoardService, //
    CrewBoardImageResolver,
    CrewBoardImageService,
  ],
})
export class CrewBoardModule {}
