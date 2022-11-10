import { OmitType } from '@nestjs/graphql';
import { CreateUserInput } from './createUser.input';

export class CreateSocialUserInput extends OmitType(CreateUserInput, [
  'name',
  'nickname',
  'gender',
  'birth',
  'phone',
]) {}
