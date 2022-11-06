import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  nickname: string;

  // Int로 할지 String으로 할지
  @Field(() => String)
  birth: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  gender: string;

  @Field(() => String, { nullable: true })
  profile_img: string;
}
