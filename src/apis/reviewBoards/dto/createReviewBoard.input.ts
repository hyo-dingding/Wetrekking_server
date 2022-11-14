import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  review: string;

  @Field(() => Float)
  star: number;
}
