import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsString } from 'class-validate';

const options: SchemaOptions = {
  timestamps: true,
};

export type RoomDocument = Room & Document;

@Schema(options)
@ObjectType()
export class Room {
  @Prop()
  @Field(() => String)
  @IsString()
  roomName: string;

  @Prop()
  @Field(() => String)
  @IsString()
  boardId: string;

  @Prop()
  @Field(() => String)
  @IsString()
  user: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
