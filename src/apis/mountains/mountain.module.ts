import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mountain } from './entities/mountain.entity';
import { MountainResolver } from './mountain.resolver';
import { MountainService } from './mountain.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mountain, //
    ]),
  ],
  providers: [
    MountainResolver, //
    MountainService,
  ],
})
export class MountainModule {}
