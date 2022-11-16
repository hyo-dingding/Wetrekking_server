import {
  Injectable,
  Logger,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Context } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { CrewUserList } from '../crewUserList/entities/crewUserListList.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { Room, RoomDocument } from './schemas/room.schema';
@WebSocketGateway({
  namespace: 'wetrekkingchat',
  cors: {
    origin: true,
    credentials: true,
  },
})
@Injectable()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // @InjectRepository(CrewBoard)
    // private readonly crewBoardRepository: Repository<CrewBoard>,

    @InjectRepository(CrewUserList)
    private readonly crewUserListRepository: Repository<CrewUserList>,

    private readonly chatService: ChatService,

    @InjectModel(Room.name)
    private readonly roomModel: mongoose.Model<RoomDocument>,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  wsClients = [];

  @SubscribeMessage('join')
  async connectSomeone(
    @MessageBody() data: string, //
    @ConnectedSocket() client: Socket,
  ) {
    const [name, roomName, boardId] = data;

    console.log('join: ', data);

    // const findUser = await this.userRepository.find({

    // })

    if (name !== null) {
      const user = await this.crewUserListRepository.findOne({
        where: {
          crewBoard: { id: boardId },
          status: '수락',
          user: { name: name },
        },
        relations: ['user', 'crewBoard'],
      });

      console.log(user);

      const findRoom = await this.roomModel.findOne({ boardId, roomName });

      if (!findRoom) {
        await this.roomModel.create({
          boardId: user.crewBoard.id,
          roomName,
          user: user.user.id,
        });
      }

      const welcome = `${user.user.name}님이 입장했습니다.`;
      console.log(welcome);

      this.server.emit('welcome' + roomName, welcome);
      this.wsClients.push(client);

      // console.log(name, roomName);
      // console.log('socket: ', client);

      // console.log('c: ', client);
    }
  }

  private broadcast(event, client, message: any) {
    for (const c of this.wsClients) {
      if (client.id == c.id) {
        continue;
      }
      c.emit(event, message);
      // console.log('e: ', event); // event는 방코드
      // console.log('c: ', c); // client는 각종 정보들
    }
  }

  // @SubscribeMessage("message")
  // connectSomeone(
  //   @MessageBody() data: string //
  // ) {
  //   const [name, room] = data; // 채팅방 입장!
  //   const receive = `${name}님이 입장했습니다.`;
  //   this.server.emit("receive" + room, receive);
  //   console.log(this.server, "server");
  // }

  @SubscribeMessage('send-chat')
  async sendMessage(
    @MessageBody() data: string, //
    @ConnectedSocket() client: Socket,
  ) {
    const [roomName, name, message] = data;
    console.log('send-chat', data);

    // const userName = await this.userRepository.findOne({
    //   where: { name },
    // });

    // this.server.emit(roomName, [name, message]);
    this.broadcast(roomName, client, [name, message]);

    await this.chatService.saveMessage({
      name,
      roomName,
      message,
    });
  }

  //
  // @SubscribeMessage('leave')
  // async leaveChatRoom(
  //   @MessageBody() data: string, //
  //   @ConnectedSocket() client,
  // ) {
  //   const [name, room] = data;

  //   const bye = `${name} 님이 나가셨습니다.`;
  //   this.server.emit('bye' + room, bye);
  // }

  afterInit() {
    this.logger.log(`===== Socket Server initialized =====`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    client.leave(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}

// const validate = await this.crewUserListRepository
//   .createQueryBuilder('crewUserList')
//   .leftJoinAndSelect('crewUserList.user', 'user')
//   .leftJoinAndSelect('crewUserList.crewBoard', 'crewBoard')
//   .where('user.id = :userId', { userId: name })
//   .andWhere('crewBoard.id = :boardId', { boardId: boardId })
//   .getOne();

// if (validate == null) {
//   throw new NotFoundException(
//     '해당 유저가 존재하지 않거나 현재 신청이 완료되지 않았습니다!!',
//   );
// }
// name = validate.user.name;
// room = validate.crewBoard.title;
