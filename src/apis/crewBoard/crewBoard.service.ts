import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrewBoard } from './entities/crewBoard.entity';

@Injectable()
export class CrewBoardService {
  constructor(
    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>, //
  ) {}

  findOneById({ crewBoardId }) {
    return this.crewBoardRepository.findOne({
      where: { id: crewBoardId },
    });
  }

  findAll() {
    return this.crewBoardRepository.find();
  }

  findAllWithDelete() {
    return this.crewBoardRepository.find({
      withDeleted: true,
    });
  }

  create({ createCrewBoardInput }) {
    const { ...crewBoard } = createCrewBoardInput;
    return this.crewBoardRepository.save({ ...crewBoard });
  }

  async update({ crewBoardId, updateCrewBoardInput }) {
    const crewBoard = await this.crewBoardRepository.findOne({
      where: { id: crewBoardId },
    });
    return this.crewBoardRepository.save({
      ...crewBoard,
      id: crewBoardId,
      ...updateCrewBoardInput,
    });
  }

  async delete({ crewBoardId }) {
    const result = await this.crewBoardRepository.softDelete({
      id: crewBoardId,
    });
    return result.affected ? true : false;
  }
}
