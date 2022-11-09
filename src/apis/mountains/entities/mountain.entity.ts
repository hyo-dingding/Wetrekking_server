import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Mountain {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  mountain: string;

  @Column({ nullable: true })
  @Field(() => String)
  address: string;
}
