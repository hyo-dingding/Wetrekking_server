import { Field, ObjectType } from '@nestjs/graphql';
import { CrewBoard } from 'src/apis/crewBoards/entities/crewBoard.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CrewBoardImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  imgUrl: string;

  @Column()
  @Field(() => Boolean)
  isMain: boolean;

  @JoinTable()
  @ManyToOne(() => CrewBoard)
  @Field(() => CrewBoard)
  crewBoard: CrewBoard;
}
