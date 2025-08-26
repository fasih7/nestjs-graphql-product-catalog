import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  originalCost?: number;

  // @Field(() => [Number], { nullable: true })
  // categoryIds?: number[];

  @Field(() => Int, { nullable: true })
  categoryId?: number;

  //   @Field(() => Int)
  //   categoryId: number;
}
