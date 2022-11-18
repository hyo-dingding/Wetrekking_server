import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsDate, IsString } from 'class-validate';

const options: SchemaOptions = {
  timestamps: true,
};

export type ChatDocument = Chat & Document;

@Schema(options)
@ObjectType()
export class Chat {
  @Prop({ required: true })
  @Field(() => String)
  @IsString()
  name: string;

  @Prop()
  @Field(() => String)
  @IsString()
  roomName: string;

  @Prop()
  @Field(() => String)
  @IsString()
  message: string;

  @Field(() => Date)
  @IsDate()
  createdAt: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
