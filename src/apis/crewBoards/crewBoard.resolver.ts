import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CrewBoardService } from './crewBoard.service';
import { CreateCrewBoardInput } from './dto/createCrewBoard.input';
import { UpdateCrewBoardInput } from './dto/updateCrewBoard.input';
import { CrewBoard } from './entities/crewBoard.entity';

@Resolver()
export class CrewBoardResolver {
  constructor(
    private readonly crewBoardService: CrewBoardService, //
  ) {}

  @Query(() => CrewBoard)
  fetchCrewBoard(@Args('crewBoardId') crewBoardId: string) {
    return this.crewBoardService.findOneById({ crewBoardId });
  }

  // @Query(() => [CrewBoard])
  // fetchAllCrewBoards() {
  //   return this.crewBoardService.findAll();
  // }

  @Query(() => [CrewBoard])
  fetchAllCrewBoardsWithDelete() {
    return this.crewBoardService.findAllWithDelete();
  }

  // 현재 시간 기준으로 이후 게시글만 나오는 fetchCrewBoards
  @Query(() => [[CrewBoard]])
  fetchCrewBoards() {
    return this.crewBoardService.findAllNew();
  }

  @Query(() => [[CrewBoard]])
  async fetchCrewBoardsTEST() {
    return await this.crewBoardService.findAllDivideNine();
  }

  // @Query(() => [CrewBoard])
  // fetchCrewBoardsSortNew() {
  //   this.crewBoardService.findAll();
  // }

  // @Query(() => [CrewBoard])
  // fetchCrewBoardsByDate(
  //   @Args('startDate') startDate: string,
  //   @Args('endDate') endDate: string,
  // ) {
  //   return this.crewBoardService.findByDate({ startDate, endDate });
  // }

  @Mutation(() => CrewBoard)
  createCrewBoard(
    @Args('createCrewBoardInput') createCrewBoardInput: CreateCrewBoardInput,
  ) {
    return this.crewBoardService.create({ createCrewBoardInput });
  }

  @Mutation(() => CrewBoard)
  async createCrewBoardTEST(
    @Args('createCrewBoardInput') createCrewBoardInput: CreateCrewBoardInput,
  ) {
    const a = await this.crewBoardService.create({ createCrewBoardInput });
    console.log(a);
    return a;
  }

  @Mutation(() => CrewBoard)
  updateCrewBoard(
    @Args('crewBoardId') crewBoardId: string,
    @Args('updateCrewBoardInput') updateCrewBoardInput: UpdateCrewBoardInput,
  ) {
    return this.crewBoardService.update({ crewBoardId, updateCrewBoardInput });
  }

  @Mutation(() => String)
  deleteCrewBoard(@Args('crewBoardId') crewBoardId: string) {
    this.crewBoardService.delete({ crewBoardId });
    return '게시글이 삭제 되었습니다.';
  }
}
