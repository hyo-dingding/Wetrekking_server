import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ReviewBoard } from './entities/reviewBoard.entity';

@Injectable()
export class ReviewBoardService {
  constructor(
    @InjectRepository(ReviewBoard)
    private readonly reviewBoardRepository: Repository<ReviewBoard>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findOneById({ reviewBoardId }) {
    return this.reviewBoardRepository.findOne({
      where: { id: reviewBoardId },
    });
  }

  findAll() {
    return this.reviewBoardRepository.find();
  }

  async create({ userId, crewUserListId, createReviewBoardInput }) {
    const isReview = this.reviewBoardRepository.find({
      where: {
        user: { id: userId },
        crewUserList: { id: crewUserListId },
      },
      relations: ['user', 'crewUserList'],
    });
    if (isReview) {
      throw new Error('이미 리뷰가 존재합니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    await this.userRepository.update(
      { id: userId },
      { point: user.point + 100 },
    );

    const { ...reviewBoard } = createReviewBoardInput;
    return this.reviewBoardRepository.save({
      ...reviewBoard,
      user: { user: { id: userId } },
      crewUserList: { crewUserList: { id: crewUserListId } },
    });
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
