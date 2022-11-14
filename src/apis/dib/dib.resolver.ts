import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';

import { Dib } from './entities/dib.entity';
import { DibService } from './dib.service';
import { check } from 'prettier';

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
  @Mutation(() => Boolean)
  async createDib(
    @Context() context: IContext,
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    const userId = context.req.user.id;

    const checkDib = await this.DibService.findOne({ crewBoardId });
    console.log(checkDib);

    if (checkDib === null) {
      this.DibService.create({ userId, crewBoardId });
      return true;
    } else {
      this.DibService.delete({ crewBoardId });
      return false;
    }
  }
}
