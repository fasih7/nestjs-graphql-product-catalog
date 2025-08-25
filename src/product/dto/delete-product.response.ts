import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteProductResponse {
  @Field()
  success: true;
}
