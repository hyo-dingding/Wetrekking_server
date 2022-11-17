import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Trekking } from './schemas/trekking.schema';
import { TrekkingInfo } from './schemas/trekkingInfo.schema';
import { TrekkingService } from './trekking.service';

@Resolver()
export class TrekkingResolver {
  constructor(
    private readonly trekkingService: TrekkingService, //
  ) {}

  // @Query(() => Trekking)
  // async fetchTrekkingInfo(
  //   @Args('address') address: string, //
  //   @Args('mountainName') mountainName: string,
  // ) {
  //   const qqq = await this.trekkingService.getEmdCdInfo({ address });

  //   return this.trekkingService.getTrekkingInfo({ qqq, mountainName });
  // }

  @Query(() => [TrekkingInfo])
  async fetchTrekkingCoordinate(
    @Args('mountainName') mountainName: string, //
  ) {
    return this.trekkingService.findTrekking({ mountainName });
  }

  @Mutation(() => [TrekkingInfo], {
    description:
      'MongoDB에 산+등산로 좌표를 저장하기 위한 API, 누르지 마요 큰일나요',
  })
  async createMongoDBTrekking() {
    return this.trekkingService.saveTrekking();
  }
}
