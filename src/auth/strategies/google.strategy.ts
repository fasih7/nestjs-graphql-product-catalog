import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthProvider, GoogleSSOObject } from '../../shared/types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_OAUTH_ID as string,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET as string,
      callbackURL: process.env.CALL_BACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<GoogleSSOObject> {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new BadRequestException('Google account has no email address.');
    }
    return {
      accessToken,
      refreshToken,
      //   photos: profile.photos,     // in form of [{value: "...."}]
      email,
      name: profile.displayName,
      provider: AuthProvider.GOOGLE,
      providerId: profile.id,
    };
  }
}
