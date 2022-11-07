import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../files/file.service';

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
    FileService,
  ],
})
export class CrewBoardImageModule {}
