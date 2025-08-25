import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserProvider } from './user-provider.entity';
import { Review } from '../../reviews/entities/review.entity';

//TODO: move to better place
export enum UserRole {
  admin = 'admin',
  user = 'user',
}

export enum UserStatus {
  active = 'active',
  pending = 'pending',
  blocked = 'blocked',
}

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 150 })
  name: string;

  @Field()
  @Column({ unique: true, length: 150 })
  email: string;

  @Field({ nullable: true })
  @Column({ length: 150, nullable: true })
  password?: string;

  @Column({ type: 'text', nullable: true })
  hashedRt?: string | null;

  @Field()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.user })
  role: UserRole;

  @Field()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.active })
  status: UserStatus;

  @OneToMany(() => UserProvider, (provider) => provider.user, {
    cascade: true,
  })
  @Field(() => [UserProvider], { nullable: true })
  providers?: UserProvider[];

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
