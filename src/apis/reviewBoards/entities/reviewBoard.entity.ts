import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CrewBoard } from 'src/apis/crewBoards/entities/crewBoard.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ReviewBoard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field(() => String)
  review: string;

  @Column()
  @Field(() => Int)
  star: number;

  @Column()
  @Field(() => Float)
  like: number;

  // @ManyToOne(()=>User)
  @Column() // 연결 전 임시
  @Field(() => String)
  userId: string;

  @ManyToOne(() => CrewBoard)
  @Field(() => String)
  crewBoardId: string;
}
