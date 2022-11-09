import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';

import { Dib } from './entities/dib.entity';
import { DibService } from './dib.service';

@Resolver()
export class DibResolver {
  constructor(
    private readonly DibService: DibService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Dib])
  async fetchDibs(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;
    const DibList = await this.DibService.findAll({ userId });
    return DibList;
  }

  // 찜하기(로그인 필수)
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async createDib(
    @Context() context: IContext,
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    const userId = context.req.user.id;

    this.DibService.create({ userId, crewBoardId });
    return '찜한 게시글이 추가 되었습니다.';
  }

  // 찜하기 취소
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteDib(
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    this.DibService.delete({ crewBoardId });
    return '찜한 게시글이 삭제 되었습니다.';
  }
}
