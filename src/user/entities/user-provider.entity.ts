import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AuthProvider } from '../../shared/types';

@ObjectType()
@Entity('user_providers')
export class UserProvider {
  @Field(() => ID)
  //   @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    type: 'enum',
    enum: AuthProvider,
  })
  provider: AuthProvider;

  @Field()
  @Column()
  providerId: string; // e.g., Google profile.id, GitHub id

  @Field({ nullable: true })
  @Column({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  refreshToken?: string;

  @ManyToOne(() => User, (user) => user.providers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;
}
