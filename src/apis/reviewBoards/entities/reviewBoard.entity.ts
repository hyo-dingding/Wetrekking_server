import { float } from '@elastic/elasticsearch/lib/api/types';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CrewBoard } from 'src/apis/crewBoards/entities/crewBoard.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  @Field(() => Float)
  star: number;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  // @ManyToOne(()=>User)
  // @Column() // 연결 전 임시
  // @Field(() => String)
  // userId: string;

  // @ManyToOne(() => CrewBoard)
  // @Field(() => String)
  // crewBoardId: string;
}
