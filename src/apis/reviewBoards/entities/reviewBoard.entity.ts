import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CrewUserList } from 'src/apis/crewUserList/entities/crweUserListList.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ReviewBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  review: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  @Field(() => Float)
  star: number;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  // @ManyToOne(() => User)
  // @Field(() => User)
  // userId: User;

  // @ManyToOne(() => CrewBoard)
  // @Field(() => CrewBoard)
  // crewBoardId: CrewBoard;

  @JoinColumn()
  @OneToOne(() => CrewUserList)
  @Field(() => CrewUserList)
  crewUserList: CrewUserList;
}
