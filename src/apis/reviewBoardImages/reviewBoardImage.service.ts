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
      where: { reviewBoard: { id: reviewBoardId } },
    });
  }

  async findAll() {
    return await this.reviewBoardImageRepository.find({});
  }

  async upload({ imgUrl, reviewBoardId }) {
    this.delete({ reviewBoardId });
    for (let i = 0; i < imgUrl.length; i++) {
      await this.reviewBoardImageRepository.save({
        imgUrl: imgUrl[i],
        isMain: i === 0 ? true : false,
        reviewBoard: { id: reviewBoardId },
      });
      return await this.findByReviewBoardId({
        reviewBoardId,
      });
    }
  }

  delete({ reviewBoardId }) {
    return this.reviewBoardImageRepository.delete({
      reviewBoard: { id: reviewBoardId },
    });
  }
}
