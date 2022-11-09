import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrewUserList } from './entities/crweUserListList.entity';

@Injectable()
export class CrewUserListService {
  @InjectRepository(CrewUserList)
  private readonly crewUserListRepository: Repository<CrewUserList>;

  async findAll({ userId }) {
    const result = [];
    const user = await this.crewUserListRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'crewBoard'],
    });
    user.map((el) => (el.user.id === userId ? result.push(el) : el));
    return result;
  }

  async create({ userId, crewBoardId }) {
    const userList = await this.crewUserListRepository.save({
      user: userId,
      crewBoard: crewBoardId,
    });
    return userList;
  }

  async delete({ crewBoardId }) {
    return await this.crewUserListRepository.delete({
      crewBoard: crewBoardId,
    });
  }
}
