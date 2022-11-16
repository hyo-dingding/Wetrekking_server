import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewBoardService } from '../crewBoards/crewBoard.service';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { CrewUserList } from '../crewUserList/entities/crewUserListList.entity';
import { User } from '../users/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { Room, RoomSchema } from './schemas/room.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      CrewBoard,
      CrewUserList,
    ]),
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: Room.name,
        schema: RoomSchema,
      },
    ]),
  ],
  providers: [ChatGateway, ChatResolver, ChatService],
})
export class ChatModule {}
