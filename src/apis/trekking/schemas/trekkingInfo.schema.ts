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
  mountainName: string;

  @Prop()
  trekkingName: string;

  @Prop()
  difficulty: string;

  @Prop()
  coordinate: number[];
}

export const TrekkingInfoSchema = SchemaFactory.createForClass(TrekkingInfo);
