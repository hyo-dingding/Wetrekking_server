import { Module } from '@nestjs/common';
import { MountainResolver } from './mountain.resolver';
import { MountainService } from './mountain.service';

@Module({
  providers: [MountainResolver, MountainService],
})
export class MountainModule {}
