import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCrewBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => Date)
  date: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  addressDetail: string;

  @Field(() => Int)
  dues: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  gender: string;

  @Field(() => Int)
  peoples: number;
}
