import { Field, ObjectType } from '@nestjs/graphql';
import { CrewBoard } from 'src/apis/crewBoards/entities/crewBoard.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CrewUserList {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: '수락 대기중' })
  @Field(() => String)
  status: string;

  @ManyToOne(() => User)
  @Field(() => User)
  userId: User;

  @ManyToOne(() => CrewBoard)
  @Field(() => CrewBoard)
  crewBoardId: CrewBoard;
}
