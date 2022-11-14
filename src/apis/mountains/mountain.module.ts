import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mountain } from './entities/mountain.entity';
import { MountainResolver } from './mountain.resolver';
import { MountainService } from './mountain.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mountain, //
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    MountainResolver, //
    MountainService,
  ],
})
export class MountainModule {}
