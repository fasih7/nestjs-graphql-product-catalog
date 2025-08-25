import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserInput, RegisterUserInput } from './dto/auth.input';
import { LoginResponse, RegisterResponse } from './dto/auth.response';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, GqlRefreshAuthGuard } from './guards/jwt-auth.gaurd';
import { RolesGuard } from './guards/role.gaurd';
import { UserRole } from '../user/entities/user.entity';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  register(@Args('registerInput') registerUserInput: RegisterUserInput) {
    return this.authService.register(registerUserInput);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginUserInput,
    @Context() ctx: any,
  ) {
    return this.authService.login(loginInput, ctx);
  }

  @UseGuards(GqlRefreshAuthGuard)
  @Mutation(() => LoginResponse)
  async refreshTokens(
    @CurrentUser() payload: { sub: string; refreshToken: string },
    @Context() ctx: any,
  ) {
    return this.authService.refreshToken(payload, ctx);
  }

  @Query(() => String)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  protectedHello(@CurrentUser() req): string {
    console.log('req here: ', req);
    return `Hello you have admin access!`;
  }
}
