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

  // @Mutation(() => [ReviewBoardImage])
  // async uploadCrewBoaredImage(
  //   @Args('imgUrl') imgUrl: string[],
  //   @Args('crewBoardId') crewBoardId: string,
  // ) {
  //   this.crewBoardImageService.delete({ crewBoardId });
  //   for (let i = 0; i < imgUrl.length; i++) {
  //     await this.crewBoardImageService.upload({
  //       imgUrl: imgUrl[i],
  //       isMain: i === 0 ? true : false,
  //       crewBoardId: crewBoardId,
  //     });
  //   }
  //   return await this.crewBoardImageService.findByCrewBoardId({ crewBoardId });
  // }
}
