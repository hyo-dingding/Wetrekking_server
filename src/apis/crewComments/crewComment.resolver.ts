import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CrewCommentService } from './crewComment.service';
import { CreateCrewCommentInput } from './dto/createCrewComment.input';
import { CreateSubCrewCommentInput } from './dto/createSubCrewComment.input';
import { UpdateCrewCommentInput } from './dto/updateCrewComment.input';
import { UpdateSubCrewCommentInput } from './dto/updateSubCrewComment.input';
import { CrewComment } from './entities/crewComment.entity';

@Resolver(() => CrewComment)
export class CrewCommentResolver {
  constructor(
    private readonly crewCommentService: CrewCommentService, //
  ) {}

  @Query(() => [CrewComment], {
    description: 'boardId에 해당하는 댓글 전체 조회',
  })
  fetchCrewComments(
    @Args('boardId') boardId: string, //
    @Args('page', { nullable: true, type: () => Int }) page: number,
  ) {
    return this.crewCommentService.findAll({ page, boardId });
  }

  @Query(() => [CrewComment], {
    description: 'userId에 해당하는 댓글 전체 조회',
  })
  fetchUserCrewComments(
    @Args('userId') userId: string, //
    @Args('boardId') boardId: string,
  ) {
    return this.crewCommentService.findUser({ userId, boardId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CrewComment, { description: '댓글 생성하기' })
  createCrewComment(
    @Context() context: IContext, //
    @Args('createCrewCommentInput')
    createCrewCommentInput: CreateCrewCommentInput,
  ) {
    const user = context.req.user.id;
    return this.crewCommentService.create({ createCrewCommentInput, user });
  }

  // 수정
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CrewComment)
  updateCrewComment(
    @Context() context: IContext, //
    @Args('commentId') commentId: string,
    @Args('updateCrewCommentInput')
    updateCrewCommentInput: UpdateCrewCommentInput,
  ) {
    const user = context.req.user.id;

    return this.crewCommentService.update({
      user,
      commentId,
      updateCrewCommentInput,
    });
  }

  // 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCrewComment(
    @Context() context: IContext, //
    @Args('commentId') commentId: string,
  ) {
    return this.crewCommentService.delete({ commentId, context });
  }

  // 이 밑으로 대댓글

  @Query(() => [CrewComment])
  fetchCrewSubComments(
    @Args('commentId') commentId: string,
    @Args('page', { nullable: true, type: () => Int }) page: number,
  ) {
    return this.crewCommentService.findSubAll({ page, commentId });
  }

  @Query(() => [CrewComment])
  fetchUserCrewSubComments(
    @Args('userId') userId: string, //
    @Args('boardId') boardId: string,
  ) {
    return this.crewCommentService.findSubUser({ userId, boardId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CrewComment)
  createCrewSubComment(
    @Args('createSubCrewCommentInput')
    createSubCrewCommentInput: CreateSubCrewCommentInput, //
    @Context() context: IContext,
  ) {
    const user = context.req.user.id;
    return this.crewCommentService.createSub({
      user,
      createSubCrewCommentInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CrewComment)
  updateCrewSubComment(
    @Args('subCommentId') subCommentId: string,
    @Args('updateSubCrewCommentInput')
    updateSubCrewCommentInput: UpdateSubCrewCommentInput, //
    @Context() context: IContext,
  ) {
    const user = context.req.user.id;

    return this.crewCommentService.updateSub({
      subCommentId,
      updateSubCrewCommentInput,
      user,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCrewSubComment(
    @Context() context: IContext, //
    @Args('subCommentId') subCommentId: string,
  ) {
    const userId = context.req.user.id;
    return this.crewCommentService.deleteSub({ subCommentId, userId });
  }
}
