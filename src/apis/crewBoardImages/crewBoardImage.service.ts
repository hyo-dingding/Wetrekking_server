import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CrewBoardImage } from './entities/crewBoardImage.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CrewBoardImageService {
  constructor(
    @InjectRepository(CrewBoardImage)
    protected readonly crewBoardImageRepository: Repository<CrewBoardImage>,
  ) {}

  async findByCrewBoardId({ crewBoardId }) {
    return await this.crewBoardImageRepository.find({
      where: { crewBoard: { id: crewBoardId } },
    });
  }

  async findAll() {
    return await this.crewBoardImageRepository.find({});
  }

  upload({ imgUrl, isMain, crewBoardId }) {
    return this.crewBoardImageRepository.save({
      imgUrl,
      isMain,
      crewBoard: crewBoardId,
    });
  }

  delete({ crewBoardId }) {
    this.crewBoardImageRepository.delete({ crewBoard: crewBoardId });
  }
}
