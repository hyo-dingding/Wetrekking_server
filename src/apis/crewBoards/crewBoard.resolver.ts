import { UseGuards } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CrewBoardImageService } from '../crewBoardImages/crewBoardImage.service';
import { DibService } from '../dib/dib.service';
import { CrewBoardService } from './crewBoard.service';
import { CreateCrewBoardInput } from './dto/createCrewBoard.input';
import { CrewBoardAndUser } from './dto/crewBoardAndUser.output';
import { UpdateCrewBoardInput } from './dto/updateCrewBoard.input';
import { CrewBoard } from './entities/crewBoard.entity';

@Resolver()
export class CrewBoardResolver {
  constructor(
    private readonly crewBoardService: CrewBoardService, //
    private readonly crewBoardImageService: CrewBoardImageService, //
    private readonly dibService: DibService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @Query(() => CrewBoard)
  fetchCrewBoard(@Args('crewBoardId') crewBoardId: string) {
    return this.crewBoardService.findOneById({ crewBoardId });
  }

  @Query(() => [CrewBoard])
  fetchAllCrewBoards() {
    return this.crewBoardService.findAll();
  }

  @Query(() => [CrewBoardAndUser])
  async fetchAllCrewBoardsWithUsers() {
    return await this.crewBoardService.findAllWithUsers();
  }

  @Query(() => [CrewBoard])
  fetchAllCrewBoardsWithDelete() {
    return this.crewBoardService.findAllWithDeleted();
  }

  @Query(() => [CrewBoardAndUser])
  async fetchCrewBoardsLatestFirst(
    @Args('region') region?: string,
    @Args('startDate') startDate?: string,
    @Args('endDate') endDate?: string,
    @Args('search') search?: string,
  ) {
    let newCrewBoard = [];
    const crewBoard = await this.crewBoardService.findAllLatestFirst();

    // if (search) {
    //   const ELKcrewBoard = await this.elasticsearchService.search({
    //     index: 'mycrewboard',
    //     query: {
    //       match_phrase_prefix: {
    //         title: search,
    //       },
    //     },
    //   });
    //   console.log(JSON.stringify(crewBoard, null, ' '));
    //   crewBoard = ELKcrewBoard.hits.hits.map((el) => {
    //     return el._source;
    //   });
    //
    //   if (!crewBoard[0]) {
    //     throw new Error(`검색어 [${search}]로 조회된 검색결과가 없습니다`);
    //   }
    // } else {
    //   crewBoard = await this.crewBoardService.findAllWithUsers();
    // }

    if (search) {
      crewBoard.map((x) =>
        x.title.includes(search) ||
        x.description.includes(search) ||
        x.mountain.mountain.includes(search)
          ? newCrewBoard.push(x)
          : x,
      );
    } else {
      newCrewBoard = crewBoard;
    }

    if (region) {
      newCrewBoard = newCrewBoard.filter(
        (x) => x.mountain.address.split(' ')[0] === region,
      );
    }

    if (startDate) {
      newCrewBoard = newCrewBoard.filter(
        (x) =>
          Date.parse(startDate) <= Date.parse(x.date) &&
          Date.parse(x.date) < Date.parse(endDate) + 86400000,
      );
    }

    return newCrewBoard;
  }

  @Query(() => [CrewBoardAndUser])
  fetchCrewBoardsDeadlineFirst() {
    return this.crewBoardService.findAllDeadlineFirst();
  }

  @Query(() => [CrewBoard])
  async fetchCrewBoardsBySearch(
    @Args('region') region?: string,
    @Args('startDate') startDate?: string,
    @Args('endDate') endDate?: string,
    @Args('search') search?: string,
  ) {
    return await this.crewBoardService.findBySearch({
      region,
      startDate,
      endDate,
      search,
    });
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
    @Args('mountainId') mountainId: string,
  ) {
    const userId = context.req.user.id;

    const result = await this.crewBoardService.create({
      userId,
      mountainId,
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
    @Args({ name: 'imgURL', type: () => [String] }) imgUrl: string[],
    @Args('mountainId') mountainId?: string,
  ) {
    if (mountainId) {
      updateCrewBoardInput['mountain'] = mountainId;
    }
    const result = this.crewBoardService.update({
      crewBoardId,
      updateCrewBoardInput,
    });
    if (imgUrl) {
      this.crewBoardImageService.upload({ imgUrl, crewBoardId });
    }
    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCrewBoard(@Args('crewBoardId') crewBoardId: string) {
    this.dibService.delete({ crewBoardId });
    console.log(crewBoardId);
    return this.crewBoardService.delete({ crewBoardId });
  }
}
