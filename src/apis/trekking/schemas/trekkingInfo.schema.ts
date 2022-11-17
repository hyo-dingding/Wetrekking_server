import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrekkingInfoDocument = TrekkingInfo & Document;

@Schema()
@ObjectType()
export class TrekkingInfo {
  // @Prop()
  // @Field(() => String)
  // mountainName: string;

  @Prop()
  @Field(() => String)
  mountainName: string;

  @Prop()
  @Field(() => String)
  trekkingName: string;

  @Prop()
  @Field(() => String)
  difficulty: string;

  @Prop()
  @Field(() => [[Float]])
  coordinate: number[][];
}

export const TrekkingInfoSchema = SchemaFactory.createForClass(TrekkingInfo);
