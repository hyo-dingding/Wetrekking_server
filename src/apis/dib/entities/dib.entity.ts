import { Field, ObjectType } from '@nestjs/graphql';
import { CrewBoard } from 'src/apis/crewBoards/entities/crewBoard.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Dib {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @JoinTable()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinTable()
  @ManyToOne(() => CrewBoard)
  @Field(() => CrewBoard)
  crewBoard: CrewBoard;
}
