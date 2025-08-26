import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Review } from '../../reviews/entities/review.entity';
// import { Category } from '../../category/entities/category.entity';

@ObjectType()
@Entity()
export class Product {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true, length: 150 })
  name: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  originalCost?: number;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  // @Field(() => [Category], { nullable: true })
  // @ManyToMany(() => Category, (category) => category.products, {
  //   cascade: true,
  // })
  // @JoinTable()
  // categories: Category[];

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category?: Category;

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews: Review[];

  @Field({ nullable: true })
  @Column('float', { nullable: true, default: null })
  averageRating: number;
}
