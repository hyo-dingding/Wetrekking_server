import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewBoardImage } from './entities/reviewBoardImage.entity';
import { ReviewBoardImageResolver } from './reviewBoardImage.resolver';
import { ReviewBoardImageService } from './reviewBoardImage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewBoardImage, //
    ]),
  ],

  providers: [
    ReviewBoardImageResolver, //
    ReviewBoardImageService,
  ],
})
export class ReviewBoardImageModule {}
