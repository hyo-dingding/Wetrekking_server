import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';

import { Pick } from './entities/pick.entity';
import { PickService } from './pick.service';

@Resolver()
export class PickResolver {
  constructor(
    private readonly pickService: PickService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Pick])
  async fetchPicks(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;
    const pickList = await this.pickService.findAll({ userId });
    return pickList;
  }

  // 찜하기(로그인 필수)
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async createPick(
    @Context() context: IContext,
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    const userId = context.req.user.id;

    this.pickService.create({ userId, crewBoardId });
    return '찜한 게시글이 추가 되었습니다.';
  }

  // 찜하기 취소
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deletePick(
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    this.pickService.delete({ crewBoardId });
    return '찜한 게시글이 삭제 되었습니다.';
  }
}
