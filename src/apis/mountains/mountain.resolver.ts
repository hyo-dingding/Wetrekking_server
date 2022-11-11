import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Mountain } from './entities/mountain.entity';
import { MountainService } from './mountain.service';

@Resolver()
export class MountainResolver {
  constructor(
    private readonly mountainService: MountainService, //
  ) {}

  @Query(() => Mountain)
  fetchMountain(@Args('mountainId') mountainId: string) {
    return this.mountainService.findMountain({ mountainId });
  }

  @Query(() => [Mountain])
  fetchMountains(@Args('mountain') mountain: string) {
    return this.mountainService.findMountains({ mountain });
  }

  @Mutation(() => String)
  createMountain() {
    const prevention = this.mountainService.findAllMountains();
    if (prevention) return '이미 등록되어 있습니다.';
    this.mountainService.create();
    return '산 등록 완료!';
  }
}
