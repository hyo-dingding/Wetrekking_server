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
  fetchCrewBoards() {
    return this.crewBoardService.findAll();
  }

  @Query(() => [CrewBoard])
  fetchCrewBoardWithDelete() {
    return this.crewBoardService.findAllWithDelete();
  }

  @Mutation(() => CrewBoard)
  createCrewBoard(
    @Args('createCrewBoardInput') createCrewBoardInput: CreateCrewBoardInput,
  ) {
    return this.crewBoardService.create({ createCrewBoardInput });
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
