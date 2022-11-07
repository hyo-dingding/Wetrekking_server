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

  @Query(() => [CrewBoard])
  fetchAllCrewBoards() {
    return this.crewBoardService.findAll();
  }

  @Query(() => [CrewBoard])
  fetchAllCrewBoardsWithDelete() {
    return this.crewBoardService.findAllWithDeleted();
  }

  @Query(() => [[CrewBoard]])
  fetchCrewBoardsLatestFirst() {
    return this.crewBoardService.findAllLatestFirst();
  }

  @Query(() => [[CrewBoard]])
  fetchCrewBoardsDeadlineFirst() {
    return this.crewBoardService.findAllDeadlineFirst();
  }

  @Query(() => [[CrewBoard]])
  async fetchCrewBoardsByDate(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    return await this.crewBoardService.findByDate({ startDate, endDate });
  }

  @Query(() => [[CrewBoard]])
  async fetchCrewBoardsTEST() {
    return await this.crewBoardService.findAllDivideNine();
  }

  @Mutation(() => CrewBoard)
  createCrewBoard(
    @Args('createCrewBoardInput') createCrewBoardInput: CreateCrewBoardInput,
  ) {
    this.crewBoardService.create({ createCrewBoardInput });
  }

  @Mutation(() => CrewBoard)
  async createCrewBoardTEST(
    @Args('createCrewBoardInput') createCrewBoardInput: CreateCrewBoardInput,
  ) {
    return await this.crewBoardService.create({ createCrewBoardInput });
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
