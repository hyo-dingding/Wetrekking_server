import { Mutation, Resolver } from '@nestjs/graphql';
import { MountainService } from './mountain.service';

@Resolver()
export class MountainResolver {
  constructor(
    private readonly mountainService: MountainService, //
  ) {}

  @Mutation(() => String)
  createMountain() {
    this.mountainService.create();
    return '제발!!!!!!!!';
  }
}
