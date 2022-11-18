import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewBoardImage } from './entities/reviewBoardImage.entity';
import { ReviewBoardImageService } from './reviewBoardImage.service';

@Resolver()
export class ReviewBoardImageResolver {
  constructor(
    private readonly reviewBoardImageService: ReviewBoardImageService, //
  ) {}

  @Query(() => [ReviewBoardImage])
  fetchReviewBoardImage(
    @Args('reviewBoardId') reviewBoardId: string, //
  ) {
    return this.reviewBoardImageService.findByReviewBoardId({ reviewBoardId });
  }

  @Query(() => [ReviewBoardImage])
  fetchAllReviewBoardImages() {
    return this.reviewBoardImageService.findAll();
  }

  @Mutation(() => [ReviewBoardImage])
  async uploadReviewBoardImage(
    @Args({ name: 'imgURL', type: () => [String] }) imgUrl: string[],
    @Args('reviewBoardId') reviewBoardId: string,
  ) {
    return this.reviewBoardImageService.upload({ imgUrl, reviewBoardId });
  }
}
