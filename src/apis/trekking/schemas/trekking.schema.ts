import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrekkingDocument = Trekking & Document;

@Schema()
@ObjectType()
export class Trekking {
  @Prop()
  @Field(() => String)
  mountainName: string;

  @Prop()
  @Field(() => [[Float]])
  coordinate: number[][];
}

export const TrekkingSchema = SchemaFactory.createForClass(Trekking);
