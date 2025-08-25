import { UserProviderService } from './../user/services/user-provider.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from 'typeorm';
import { User, UserStatus } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { GoogleSSOObject } from '../shared/types';
import { UserProvider } from '../user/entities/user-provider.entity';
import { setRtCookie } from '../shared/cookies';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userProviderService: UserProviderService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserParams: any) {
    try {
      const { password: plainPassword } = registerUserParams;
      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      await this.userService.create({
        ...registerUserParams,
        password: hashedPassword,
      });
      return { success: true };
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async login({ email, password }, ctx: any) {
    const user = await this.userService.findOneWithEmail(email);
    if (!user) throw new UnauthorizedException('Wrong Email or password');

    if (!user?.password) {
      throw new UnauthorizedException('Wrong Email or password');
    }

    const validate = await validatePassword(password, user?.password);
    if (!validate) throw new UnauthorizedException('Wrong Email or password');

    // if (!checkStatus(user.status))
    //   throw new InternalServerErrorException('Something went wrong');

    const { access_token, refreshToken } = await this.generateLoginTokens(user);
    setRtCookie(ctx.res, refreshToken);

    return { access_token };
  }

  async refreshToken({ sub: userId, refreshToken }, ctx: any) {
    const { access_token, refreshToken: newRt } = await this.rotateRefreshToken(
      userId,
      refreshToken,
    );

    setRtCookie(ctx.res, newRt);
    return { access_token };
  }

  async googleSSOLogin(googleLoginParams: GoogleSSOObject) {
    //TODO: need to update access token in DB and logout, no need for now
    const { providerId, email } = googleLoginParams;
    let userProvider = await this.userProviderService.getUserProviderWithId(
      providerId,
      { relations: ['user'] },
    );

    if (userProvider) {
      return await this.generateAccessToken(userProvider.user);
    }

    let user = await this.userService.findOneWithEmail(email);
    if (!user) {
      user = await this.userService.create(googleLoginParams);
    }

    const createProviderParams = mapProviderParams(user.id, googleLoginParams);
    userProvider =
      await this.userProviderService.createUserProvider(createProviderParams);

    return await this.generateAccessToken(userProvider.user);
  }

  async logout(userId: number) {
    await this.clearRefreshToken(userId);
  }

  //--------------- Internal Helpers ------------------//

  private async getTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [access_token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_TTL ?? '30d',
      }),
    ]);

    return { access_token, refreshToken };
  }

  private async setRefreshToken(userId: number, rt: string) {
    const salt = await bcrypt.genSalt(14);
    const hash = await bcrypt.hash(rt, salt);

    await this.userService.update(userId, { hashedRt: hash });
  }

  private async clearRefreshToken(userId: number) {
    await this.userService.update(userId, { hashedRt: null });
  }

  private async generateLoginTokens(user: User) {
    const tokens = await this.getTokens(user);
    await this.setRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async rotateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access denied');
    }

    const valid = await validatePassword(refreshToken, user.hashedRt);
    if (!valid) {
      this.clearRefreshToken(userId);
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokens = await this.getTokens(user);
    this.setRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  private async generateAccessToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

//--------------- Helpers ------------------//
const validatePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

const checkStatus = (status: string) => {
  // if (status === Status.pending)
  //   throw new UnprocessableEntityException('User has not been verified yet');
  // if (status === UserStatus.blocked)
  //   throw new UnprocessableEntityException('User has been blocked');
  // return status === UserStatus.active;
};

function mapProviderParams(
  userId: number,
  params: GoogleSSOObject,
): Partial<UserProvider> & { userId: number } {
  const { providerId, provider, accessToken, refreshToken } = params;
  return { provider, providerId, accessToken, refreshToken, userId };
}
