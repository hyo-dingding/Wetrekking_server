import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pick } from './entities/pick.entity';

@Injectable()
export class PickService {
  constructor(
    @InjectRepository(Pick)
    private readonly pickRepository: Repository<Pick>,
  ) {}

  async findAll({ userId }) {
    const result = [];
    const user = await this.pickRepository.find({
      //   where: { user: userId },
      relations: ['user', 'crewBoard'],
    });

    user.map((el) => (el.user.id === userId ? result.push(el) : el));
    return result;
  }

  findOne({ crewBoardId }) {
    return this.pickRepository.findOne({
      where: { crewBoard: crewBoardId },
    });
  }

  create({ userId, crewBoardId }) {
    return this.pickRepository.save({
      user: userId,
      crewBoard: crewBoardId,
    });
  }

  async delete({ crewBoardId }) {
    return await this.pickRepository.delete({
      crewBoard: crewBoardId,
    });
  }
}
