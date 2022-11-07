import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewBoardImage } from '../reviewBoardImages/entities/reviewBoardImage.entity';
import { ReviewBoardResolver } from './reviewBoard.resolver';
import { ReviewBoardService } from './reviewBoard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewBoardImage, //
    ]),
  ],
  providers: [
    ReviewBoardResolver, //
    ReviewBoardService,
  ],
})
export class ReviewBoardModule {}
