import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Mountain } from 'src/apis/mountains/entities/mountain.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CrewBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  description: string;

  // @Column()
  // deadline: Date;

  @Column()
  @Field(() => String)
  date: string;

  @Column()
  @Field(() => String)
  dateTime: string;

  @Column()
  @Field(() => String)
  addressDetail: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  gender: string;

  @Column()
  @Field(() => Int)
  dues: number;

  @Column()
  @Field(() => Int)
  peoples: number;

  @Column()
  @Field(() => String)
  thumbnail: string;

  @JoinTable()
  @ManyToOne(() => Mountain)
  @Field(() => Mountain)
  mountain: Mountain;

  @JoinTable()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
