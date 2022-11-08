import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSubCrewCommentInput {
  @Field(() => String)
  subComment: string;

  @Field(() => String)
  parentId: string;
}
