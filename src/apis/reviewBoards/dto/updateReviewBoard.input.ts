import { InputType, PartialType } from '@nestjs/graphql';
import { CreateReviewBoardInput } from './createReviewBoard.input';

@InputType()
export class UpdateReviewBoardInput extends PartialType(
  CreateReviewBoardInput,
) {}
