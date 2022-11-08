import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { User } from '../users/entities/user.entity';
import { Pick } from './entities/pick.entity';
import { PickResolver } from './pick.resolver';
import { PickService } from './pick.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pick, //
      User,
      CrewBoard,
    ]),
  ],
  providers: [
    PickResolver, //
    PickService,
  ],
})
export class PickModule {}
