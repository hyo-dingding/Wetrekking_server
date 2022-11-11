import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CrewBoardImage } from './entities/crewBoardImage.entity';
import { CrewBoardImageService } from './crewBoardImage.service';

@Resolver()
export class CrewBoardImageResolver {
  constructor(
    private readonly crewBoardImageService: CrewBoardImageService, //
  ) {}

  @Query(() => [CrewBoardImage])
  fetchBoardImage(
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    return this.crewBoardImageService.findByCrewBoardId({ crewBoardId });
  }

  @Query(() => [CrewBoardImage])
  fetchAllCrewBoardImages() {
    return this.crewBoardImageService.findAll();
  }

  @Mutation(() => [CrewBoardImage])
  async uploadCrewBoardImage(
    @Args({ name: 'imgURL', type: () => [String] }) imgUrl: string[],
    @Args('crewBoardId') crewBoardId: string,
  ) {
    return this.crewBoardImageService.upload({ imgUrl, crewBoardId });
  }
}
