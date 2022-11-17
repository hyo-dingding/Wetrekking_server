import { Field, ObjectType } from '@nestjs/graphql';
import { CrewBoardAndUser } from 'src/apis/crewBoards/dto/crewBoardAndUser.output';
import { User } from 'src/apis/users/entities/user.entity';

@ObjectType()
export class DibsWithCrewBoard {
  @Field(() => String)
  id: string;

  @Field(() => User)
  user: User;

  @Field(() => CrewBoardAndUser)
  crewBoard: CrewBoardAndUser;
}
