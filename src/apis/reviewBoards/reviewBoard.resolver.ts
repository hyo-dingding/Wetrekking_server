import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { ReviewBoardImageService } from '../reviewBoardImages/reviewBoardImage.service';
import { CreateReviewBoardInput } from './dto/createReviewBoard.input';
import { UpdateReviewBoardInput } from './dto/updateReviewBoard.input';
import { ReviewBoard } from './entities/reviewBoard.entity';
import { ReviewBoardService } from './reviewBoard.service';

@Resolver()
export class ReviewBoardResolver {
  constructor(
    private readonly reviewBoardService: ReviewBoardService,
    private readonly reviewBoardImageService: ReviewBoardImageService,
  ) {}

  @Query(() => ReviewBoard)
  fetchReviewBoard(@Args('reviewBoardId') reviewBoardId: string) {
    return this.reviewBoardService.findOneById({ reviewBoardId });
  }

  @Query(() => [ReviewBoard])
  fetchReviewBoards() {
    return this.reviewBoardService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ReviewBoard)
  async createReviewBoard(
    @Context() context: IContext,
    @Args('createReviewBoardInput')
    createReviewBoardInput: CreateReviewBoardInput,
    @Args('crewUserListId') crewUserListId: string,
    @Args({ name: 'imgURL', type: () => [String] }) imgUrl: string[],
  ) {
    const userId = context.req.user.id;

    const result = await this.reviewBoardService.create({
      userId,
      crewUserListId,
      createReviewBoardInput,
    });
    const reviewBoardId = result.id;
    this.reviewBoardImageService.upload({ imgUrl, reviewBoardId });

    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ReviewBoard)
  updateReviewBoard(
    @Args('reviewBoardId') reviewBoardId: string,
    @Args('updateReviewBoardInput')
    updateReviewBoardInput: UpdateReviewBoardInput,
    @Args({ name: 'imgURL', type: () => [String] }) imgUrl?: string[],
  ) {
    const result = this.reviewBoardService.update({
      reviewBoardId,
      updateReviewBoardInput,
    });

    if (imgUrl) {
      this.reviewBoardImageService.upload({ imgUrl, reviewBoardId });
    }
    return result;
  }
}
