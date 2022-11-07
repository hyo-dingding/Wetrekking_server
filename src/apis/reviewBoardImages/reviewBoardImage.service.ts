import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReviewBoardImage } from './entities/reviewBoardImage.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewBoardImageService {
  constructor(
    @InjectRepository(ReviewBoardImage)
    protected readonly reviewBoardImageRepository: Repository<ReviewBoardImage>,
  ) {}

  async findByReviewBoardId({ reviewBoardId }) {
    return await this.reviewBoardImageRepository.find({
      where: { reviewBoardId },
    });
  }

  async findAll() {
    return await this.reviewBoardImageRepository.find({});
  }

  upload({ imgUrl, isMain, reviewBoardId }) {
    return this.reviewBoardImageRepository.save({
      imgUrl,
      isMain,
      reviewBoardId,
    });
  }

  delete({ reviewBoardId }) {
    this.reviewBoardImageRepository.delete({ reviewBoardId });
  }
}
