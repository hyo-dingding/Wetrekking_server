import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trekking, TrekkingScchema } from './schemas/trekking.schema';
import { TrekkingResolver } from './trekking.resolver';
import { TrekkingService } from './trekking.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Trekking.name,
        schema: TrekkingScchema,
      },
    ]),
  ],
  providers: [TrekkingResolver, TrekkingService],
})
export class TrekkingModule {}
