import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewBoardImage } from './entities/crewBoardImage.entity';
import { CrewBoardImageResolver } from './crewBoardImage.resolver';
import { CrewBoardImageService } from './crewBoardImage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CrewBoardImage, //
    ]),
  ],

  providers: [
    CrewBoardImageResolver, //
    CrewBoardImageService,
  ],
})
export class CrewBoardImageModule {}
