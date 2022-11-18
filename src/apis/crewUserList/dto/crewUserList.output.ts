import { Field, ObjectType } from '@nestjs/graphql';
import { CrewBoardAndUser } from 'src/apis/crewBoards/dto/crewBoardAndUser.output';
import { CrewBoardAndList } from 'src/apis/crewBoards/dto/crewUserList.output';
import { CrewBoard } from 'src/apis/crewBoards/entities/crewBoard.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Entity } from 'typeorm';

@Entity()
@ObjectType()
export class CrewUserListAndUser {
  @Field(() => String)
  id: string;

  // @Field(() => String)
  // status: string;

  @Field(() => User)
  user: User;

  @Field(() => CrewBoardAndList)
  crewBoard: CrewBoardAndList;
}
