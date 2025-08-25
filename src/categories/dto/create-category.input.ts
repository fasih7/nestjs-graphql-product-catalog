import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field()
  name: string;
}

// @InputType()
// export class UpdateCategoryInput {
//   @Field(() => ID)
//   id: number;

//   @Field({ nullable: true })
//   name?: string;
// }
