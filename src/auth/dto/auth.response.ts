import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RegisterResponse {
  @Field()
  success: boolean;
}

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;
}
