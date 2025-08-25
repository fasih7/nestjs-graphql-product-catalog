import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field()
  productId: number;

  @Field()
  rating: number;

  @Field({ nullable: true })
  comment?: string;
}
