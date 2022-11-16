import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { Repository } from 'typeorm';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { CrewUserList } from '../crewUserList/entities/crewUserListList.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { Chat } from './schemas/chat.schema';
import { Room } from './schemas/room.schema';

@Resolver()
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService, //

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>,
  ) {}

  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => ChatRoom)
  // createChatRoom(
  //   @Args('boardId') boardId: string, //
  //   @Context() context: IContext,
  //   // @Args('hostId') hostId: string,
  //   // @Args({ name: 'userId', type: () => [String] }) userId: string[],
  // ) {
  //   const userId = context.req.user.id;
  //   return this.chatService.create({ boardId, userId });
  // }

  @Query(() => [Chat])
  fetchLogs(
    @Args('roomName') roomName: string, //
  ) {
    return this.chatService.findLog({ roomName });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Room)
  createRoom(
    @Args('boardId') boardId: string, //
    @Args('roomName') roomName: string,
    @Context() context: IContext,
  ) {
    const user = {
      id: context.req.user.id,
      name: context.req.user.email,
    };
    return this.chatService.create({ boardId, roomName, user });
  }

  // 채팅방 유저들 정보 얻어오기 - 분산 트랜잭션???????

  @Query(() => [CrewUserList])
  fetchChatUsers(@Args('boardId') boardId: string) {
    return this.chatService.findChatUser({ boardId });
  }
}
