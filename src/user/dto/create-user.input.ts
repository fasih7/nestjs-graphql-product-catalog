import { InputType, Field } from '@nestjs/graphql';
import { UserRole, UserStatus } from '../entities/user.entity'; // adjust path

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  password?: string;

  // @Field(() => UserRole, { nullable: true })
  // role?: UserRole;

  // @Field(() => UserStatus, { nullable: true })
  // status?: UserStatus;
}

@InputType()
export class GetUserByEmailInput {
  @Field()
  email: string;
}
