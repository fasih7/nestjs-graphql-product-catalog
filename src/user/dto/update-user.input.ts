import { User } from '../entities/user.entity';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(User) {
  // @Field(() => Int)
  // id: number;
}
