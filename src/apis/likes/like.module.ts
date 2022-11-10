import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewBoard } from '../reviewBoards/entities/reviewBoard.entity';
import { User } from '../users/entities/user.entity';
import { Like } from './entities/like.entity';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Like, //
      User,
      ReviewBoard,
    ]),
  ],

  providers: [
    LikeResolver, //
    LikeService,
  ],
})
export class LikeModule {}
