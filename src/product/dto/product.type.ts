import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field((type) => Date)
  createdAt: Date;

  @Field()
  originalCost: number;
}
