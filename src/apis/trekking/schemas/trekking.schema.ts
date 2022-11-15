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
  coordinate: number[];

  @Field(() => [[Float]])
  xyz: number[][];
}

export const TrekkingScchema = SchemaFactory.createForClass(Trekking);
