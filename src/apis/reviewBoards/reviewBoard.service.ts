import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewBoard } from './entities/reviewBoard.entity';

@Injectable()
export class ReviewBoardService {
  constructor(
    @InjectRepository(ReviewBoard)
    private readonly reviewBoardRepository: Repository<ReviewBoard>,
  ) {}

  findAll() {
    return this.reviewBoardRepository.find();
  }

  create({ createReviewBoardInput }) {
    const { ...reviewBoard } = createReviewBoardInput;
    return this.reviewBoardRepository.save({ ...reviewBoard });
  }

  async update({ reviewBoardId, updateReviewBoardInput }) {
    const reviewBoard = await this.reviewBoardRepository.findOne({
      where: { id: reviewBoardId },
    });
    return this.reviewBoardRepository.save({
      ...reviewBoard,
      id: reviewBoardId,
      ...updateReviewBoardInput,
    });
  }

  async delete({ reviewBoardId }) {
    const result = await this.reviewBoardRepository.softDelete({
      id: reviewBoardId,
    });
    return result.affected ? true : false;
  }
}
