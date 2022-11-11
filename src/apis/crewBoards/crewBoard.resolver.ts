import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CrewBoardImageService } from '../crewBoardImages/crewBoardImage.service';
import { CrewBoardService } from './crewBoard.service';
import { CreateCrewBoardInput } from './dto/createCrewBoard.input';
import { UpdateCrewBoardInput } from './dto/updateCrewBoard.input';
import { CrewBoard } from './entities/crewBoard.entity';

@Resolver()
export class CrewBoardResolver {
  constructor(
    private readonly crewBoardService: CrewBoardService, //
    private readonly crewBoardImageService: CrewBoardImageService, //
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
    return await this.crewBoardService.findAllDivideNineForTest();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CrewBoard)
  async createCrewBoard(
    @Context() context: IContext,
    @Args('createCrewBoardInput') createCrewBoardInput: CreateCrewBoardInput,
    @Args({ name: 'imgURL', type: () => [String] }) imgUrl: string[],
  ) {
    const userId = context.req.user.id;

    const result = await this.crewBoardService.create({
      userId,
      createCrewBoardInput,
    });

    const crewBoardId = result.id;
    await this.crewBoardImageService.upload({ imgUrl, crewBoardId });

    return result;
  }

  @Mutation(() => CrewBoard)
  async createCrewBoardTEST(
    @Args('createCrewBoardInput') createCrewBoardInput: CreateCrewBoardInput,
  ) {
    return await this.crewBoardService.createTEST({ createCrewBoardInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CrewBoard)
  updateCrewBoard(
    @Args('crewBoardId') crewBoardId: string,
    @Args('updateCrewBoardInput') updateCrewBoardInput: UpdateCrewBoardInput,
  ) {
    return this.crewBoardService.update({ crewBoardId, updateCrewBoardInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCrewBoard(@Args('crewBoardId') crewBoardId: string) {
    return this.crewBoardService.delete({ crewBoardId });
  }
}
