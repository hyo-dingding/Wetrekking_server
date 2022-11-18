import {
  Injectable,
  Logger,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
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
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { CrewUserList } from '../crewUserList/entities/crewUserList.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { Room, RoomDocument } from './schemas/room.schema';
@WebSocketGateway({
  namespace: 'wetrekkingchat',
  cors: {
    origin: [
      'http://localhost:3000',
      'https://develop.wetrekking.kr',
      'https://wetrekking.kr',
      'http://localhost:5501',
      'http://localhost:5500',
    ],
    credentials: true,
    exposedHeaders: ['Set-Cookie', 'Cookie'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Authorization',
      'X-Requested-With',
      'Content-Type',
      'Accept',
    ],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>,

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

    const user = await this.crewUserListRepository
      .createQueryBuilder('crewUserList')
      .leftJoinAndSelect('crewUserList.user', 'user')
      .leftJoinAndSelect('crewUserList.crewBoard', 'crewBoard')
      .where('crewUserList.status = "수락"')
      .andWhere('crewBoard.id = :boardId', { boardId })
      .andWhere('user.name = :name', { name })
      .getOne();

    console.log(user);
    if (name !== user.user.name) throw new Error('이름이 일치하지 않습니다.');

    const findRoom = await this.roomModel.findOne({ boardId, roomName });
    const findBoard = await this.crewBoardRepository.findOne({
      where: { id: boardId },
    });

    if (!findRoom) {
      await this.roomModel.create({
        boardId: user.crewBoard.id,
        roomName: findBoard.title,
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

  // @SubscribeMessage('leave')
  // async leaveChatRoom(
  //   @MessageBody() data: string, //
  //   @ConnectedSocket() client,
  // ) {
  //   const [room, name] = data;

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
