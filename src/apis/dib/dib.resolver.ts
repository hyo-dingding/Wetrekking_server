import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { DibService } from './dib.service';
import { DibsWithCrewBoard } from './dto/dibsWithCrewBoard.output';

@Resolver()
export class DibResolver {
  constructor(
    private readonly dibService: DibService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [DibsWithCrewBoard])
  async fetchDibs(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;
    const result = await this.dibService.findAll({ userId });
    return result;
  }

  // 찜하기(로그인 필수)
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async createDib(
    @Context() context: IContext,
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    const userId = context.req.user.id;

    const checkDib = await this.dibService.findOne({ userId, crewBoardId });
    console.log(checkDib);

    if (checkDib === null) {
      this.dibService.create({ userId, crewBoardId });
      return true;
    } else {
      this.dibService.delete({ crewBoardId });
      return false;
    }
  }
}
