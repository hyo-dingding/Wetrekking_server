import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CrewUserListService } from './crewUserList.service';
import { CrewUserList } from './entities/crweUserListList.entity';

@Resolver()
export class CrewUserListResolver {
  constructor(
    private readonly crewUserListService: CrewUserListService, //
  ) {}

  // 산 신청리스트
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [CrewUserList])
  async fetchCrewUserList(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;

    const user = await this.crewUserListService.findAll({ userId });

    return user;
  }

  // 산 신청 추가
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async createCrewUserList(
    @Context() context: IContext,
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    const userId = context.req.user.id;

    await this.crewUserListService.create({ userId, crewBoardId });
    return ' 산 리스트에 추가 되었습니다.';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteCrewUserList(
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    await this.crewUserListService.delete({ crewBoardId });
    return '신청이 취소 되었습니다.';
  }
}
