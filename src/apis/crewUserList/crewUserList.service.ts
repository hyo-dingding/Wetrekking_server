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

  async findVisitToList({ userId }) {
    return await this.crewUserListRepository.find({
      where: { user: { id: userId }, status: '완료' },
      relations: ['user', 'crewBoard'],
    });
  }

  findOne(type) {
    return this.crewUserListRepository.findOne({
      where: type,
    });
  }

  async create({ userId, crewBoardId }) {
    const userList = await this.crewUserListRepository.save({
      user: userId,
      crewBoard: crewBoardId,
    });
    return userList;
  }

  async update({ status, id }) {
    const crewUserList = await this.findOne({ id: id });
    const { ...crewUserListId } = crewUserList;

    return this.crewUserListRepository.save({
      ...crewUserListId,
      id: id,
      status: status,
    });
  }

  async delete({ crewBoardId }) {
    return await this.crewUserListRepository.delete({
      crewBoard: crewBoardId,
    });
  }
}
