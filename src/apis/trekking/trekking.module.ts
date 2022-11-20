import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trekking, TrekkingSchema } from './schemas/trekking.schema';
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
      {
        name: Trekking.name,
        schema: TrekkingSchema,
      },
    ]),
  ],
  providers: [TrekkingResolver, TrekkingService],
})
export class TrekkingModule {}
