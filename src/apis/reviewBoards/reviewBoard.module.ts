import { Module } from '@nestjs/common';
import { ReviewBoardResolver } from './reviewBoard.resolver';
import { ReviewBoardService } from './reviewBoard.service';

@Module({
  providers: [
    ReviewBoardResolver, //
    ReviewBoardService,
  ],
})
export class ReviewBoardModule {}
