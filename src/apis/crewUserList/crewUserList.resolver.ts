import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { CrewUserListService } from './crewUserList.service';
import { CrewUserList } from './entities/crewUserList.entity';

@Resolver()
export class CrewUserListResolver {
  constructor(
    private readonly crewUserListService: CrewUserListService, //
  ) {}

  // 크루 신청 리스트 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [CrewUserList])
  async fetchCrewUserList(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;

    const user = await this.crewUserListService.findAll({ userId });

    return user;
  }

  // 방장인 올린 게시글 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [CrewBoard])
  async fetchHostCrewList(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;

    return await this.crewUserListService.findHostList({ userId });
  }

  // 크루 리스트 추가
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async createCrewUserList(
    @Context() context: IContext,
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    const userId = context.req.user.id;
    const find = await this.crewUserListService.findCrewList({
      crewBoardId,
      userId,
    });

    if (find.length !== 0) {
      throw new Error('이미 신청한 게시글입니다.');
    }

    await this.crewUserListService.create({ userId, crewBoardId });
    return ' 크루 리스트에 추가 되었습니다.';
  }

  // 크루 리스트 신청 취소
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteCrewUserList(
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    await this.crewUserListService.delete({ crewBoardId });
    return '크루 신청이 취소 되었습니다.';
  }

  // 크루 수락
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CrewUserList)
  async acceptCrew(
    @Args('id') id: string, //
  ) {
    return this.crewUserListService.update({
      id,
      status: '수락',
    });
  }

  // 크루 거절
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CrewUserList)
  async rejectCrew(
    @Args('id') id: string, //
  ) {
    return this.crewUserListService.update({
      id,
      status: '거절',
    });
  }

  // 반장이 출석체크 하면 status를 완료로 변경
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CrewUserList)
  async finishCrew(
    @Args('id') id: string, //
  ) {
    return this.crewUserListService.update({
      id,
      status: '완료',
    });
  }

  // 갔던 산 리스트 조회 (status를 완료로 변경된 사항만 조회 가능)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [CrewUserList])
  async fetchVisitList(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;

    const finishList = await this.crewUserListService.findVisitToList({
      userId,
    });

    return finishList;
  }
}
