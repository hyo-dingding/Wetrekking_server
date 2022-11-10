import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { ReviewComment } from './entities/reviewComment.entity';
import { ReviewCommentService } from './reviewComment.service';

@Resolver()
export class ReviewCommentResolver {
  constructor(
    private readonly reviewCommentService: ReviewCommentService, //
  ) {}

  // 유저 나중에 추가

  @Query(() => [ReviewComment])
  fetchReviewComments(
    @Args('reviewBoardId') reviewBoardId: string, //
    @Args('page', { nullable: true, type: () => Int }) page: number,
  ) {
    return this.reviewCommentService.findAll({ reviewBoardId, page });
  }

  //   @Query(() => ReviewComment)
  //   fetchReviewComment() {
  //     //
  //   }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ReviewComment)
  createReviewComment(
    @Args('reviewBoardId') reviewBoardId: string, //
    @Args('reviewComment') reviewComment: string,
    @Context() context: IContext,
  ) {
    const user = context.req.user.email;
    return this.reviewCommentService.create({
      user,
      reviewBoardId,
      reviewComment,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ReviewComment)
  updateReviewComment(
    @Args('reviewCommentId') reviewCommentId: string, //
    @Args('updateComment') updateComment: string,
    @Context() context: IContext,
  ) {
    const user = context.req.user.email;
    return this.reviewCommentService.update({
      user,
      reviewCommentId,
      updateComment,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteReviewComment(
    @Args('reviewCommentId') reviewCommentId: string, //
    @Context() context: IContext,
  ) {
    const user = context.req.user.email;
    return this.reviewCommentService.delete({ user, reviewCommentId });
  }
}
