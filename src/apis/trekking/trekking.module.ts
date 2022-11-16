import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trekking, TrekkingScchema } from './schemas/trekking.schema';
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
        name: Trekking.name,
        schema: TrekkingScchema,
      },
      {
        name: TrekkingInfo.name,
        schema: TrekkingInfoSchema,
      },
    ]),
  ],
  providers: [TrekkingResolver, TrekkingService],
})
export class TrekkingModule {}
