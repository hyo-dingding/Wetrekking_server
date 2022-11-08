import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewBoard } from './entities/reviewBoard.entity';
import { ReviewBoardResolver } from './reviewBoard.resolver';
import { ReviewBoardService } from './reviewBoard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewBoard, //
    ]),
  ],
  providers: [
    ReviewBoardResolver, //
    ReviewBoardService,
  ],
})
export class ReviewBoardModule {}
