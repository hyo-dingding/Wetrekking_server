import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Mountain } from 'src/apis/mountains/entities/mountain.entity';
import { User } from 'src/apis/users/entities/user.entity';

@ObjectType()
export class CrewBoardAndUser {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  date: string;

  @Field(() => String)
  dateTime: string;

  @Field(() => String)
  addressDetail: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  gender: string;

  @Field(() => Int)
  dues: number;

  @Field(() => Int)
  peoples: number;

  @Field(() => String)
  thumbnail: string;

  @Field(() => Mountain)
  mountain: Mountain;

  @Field(() => User)
  user: User;

  @Field(() => [User])
  dibUsers: User[];

  @Field(() => [User])
  assignedUsers: User[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}
