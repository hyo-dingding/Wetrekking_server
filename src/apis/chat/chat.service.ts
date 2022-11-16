import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { User } from '../users/entities/user.entity';

import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import mongoose from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CrewUserList } from '../crewUserList/entities/crewUserListList.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CrewUserList)
    private readonly crewUserListRepository: Repository<CrewUserList>,

    @InjectModel(Chat.name)
    private readonly chatModel: mongoose.Model<ChatDocument>,

    @InjectModel(Room.name)
    private readonly roomModel: mongoose.Model<RoomDocument>,
  ) {}

  async create({ boardId, roomName, user }) {
    const existUser = await this.crewUserListRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user', 'crewBoard'],
    });

    const result = await this.roomModel.create({
      roomName,
      boardId,
      user: existUser.user.name,
    });

    return result;
  }

  async findLog({ roomName }) {
    const result = await this.chatModel.findOne({ roomName });

    if (result === null) return null;

    return await this.chatModel.find({ roomName });
  }

  async saveMessage({ name, roomName, message }) {
    const result = await this.chatModel.create({
      name,
      roomName,
      message,
    });

    return result;
  }
}
