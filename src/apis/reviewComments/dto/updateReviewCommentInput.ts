import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class updateReviewCommentInput {
  @Field(() => String, { nullable: true })
  reviewCommentId: string;

  @Field(() => String, { nullable: true })
  comment: string;
}
