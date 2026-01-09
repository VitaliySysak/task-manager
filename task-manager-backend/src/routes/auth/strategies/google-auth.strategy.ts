import type { ConfigType } from '@nestjs/config';

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';

import { AuthService } from '../auth.service';
import googleOauthConfig from '../config/google-oauth.config';
import { GoogleLoginDto } from '../dto/login.dto';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY) googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientId,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callBackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile, done: VerifiedCallback): Promise<void> {
    if (!profile.name || !profile.emails?.[0]) {
      throw new BadRequestException('Incomplete Google profile data');
    }

    const userInfo: GoogleLoginDto = {
      fullName: profile.name.givenName + profile.name.familyName,
      avatarUrl: profile.photos?.[0]?.value || profile._json?.picture || '',
      email: profile.emails[0].value,
      password: '',
      providerId: profile.id,
    };

    const user = await this.authService.validateGoogleUser(userInfo);

    done(null, user);
  }
}
