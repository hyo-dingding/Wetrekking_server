import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Trekking } from './schemas/trekking.schema';
import { TrekkingService } from './trekking.service';

@Resolver()
export class TrekkingResolver {
  constructor(
    private readonly trekkingService: TrekkingService, //
  ) {}

  @Query(() => Trekking)
  async fetchTrekkingInfo(
    @Args('address') address: string, //
    @Args('mountainName') mountainName: string,
  ) {
    const qqq = await this.trekkingService.getEmdCdInfo({ address });

    return this.trekkingService.getTrekkingInfo({ qqq, mountainName });
  }

  @Mutation(() => String)
  async createMongoDBTrekking() {
    return this.trekkingService.saveTrekking();
  }
}
