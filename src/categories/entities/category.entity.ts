import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('categories')
@ObjectType()
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  // @Field(() => [Product], { nullable: 'itemsAndList' }) // allows both [] and null items
  // @ManyToMany(() => Product, (product) => product.categories, { eager: false })
  // products?: Product[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
