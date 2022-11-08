import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validate';
import { Document, SchemaOptions } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Chat extends Document {
  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop()
  @IsString()
  chat: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
