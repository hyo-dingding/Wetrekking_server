import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Mountain } from './entities/mountain.entity';
import { MountainService } from './mountain.service';

@Resolver()
export class MountainResolver {
  constructor(
    private readonly mountainService: MountainService, //
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @Query(() => Mountain)
  fetchMountain(@Args('mountainId') mountainId: string) {
    return this.mountainService.findMountain({ mountainId });
  }

  @Query(() => [Mountain])
  fetchAllMountains() {
    return this.mountainService.findAllMountains();
  }

  @Query(() => [Mountain])
  async fetchMountainsWithSearch(
    @Args('search') search?: string, //
  ) {
    if (!search) {
      return this.mountainService.findAllMountains();
    }

    const elasticResult = await this.elasticsearchService.search({
      index: 'mymountain',
      query: {
        match_phrase_prefix: {
          mountain: search,
        },
      },
      size: 3000,
    });

    console.log(JSON.stringify(elasticResult, null, ' '));
    const result = elasticResult.hits.hits.map((el) => {
      return el._source;
    });

    if (!result[0]) {
      throw new Error(`검색어 [${search}]로 조회된 검색결과가 없습니다`);
    }

    console.log(result);
    return result;
  }

  @Mutation(() => String)
  createMountain() {
    const prevention = this.mountainService.findAllMountains();
    if (prevention) return '이미 등록되어 있습니다.';
    this.mountainService.create();
    return '산 등록 완료!';
  }
}
