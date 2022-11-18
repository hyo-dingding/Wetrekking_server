import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TrekkingInfo,
  TrekkingInfoSchema,
} from './schemas/trekkingInfo.schema';
import { TrekkingResolver } from './trekking.resolver';
import { TrekkingService } from './trekking.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TrekkingInfo.name,
        schema: TrekkingInfoSchema,
      },
    ]),
  ],
  providers: [TrekkingResolver, TrekkingService],
})
export class TrekkingModule {}
