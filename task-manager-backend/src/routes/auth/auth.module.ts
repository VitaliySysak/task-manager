import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailModule } from '@/email/email.module';
import { AuthController } from '@/routes/auth/auth.controller';
import { AuthService } from '@/routes/auth/auth.service';
import googleOauthConfig from '@/routes/auth/config/google-oauth.config';
import { GoogleAuthStrategy } from '@/routes/auth/strategies/google-auth.strategy';
import { TasksModule } from '@/routes/tasks/tasks.module';

import { cookieConfig } from './config/cookie.config';

@Module({
  imports: [
    ConfigModule.forFeature(cookieConfig),
    ConfigModule.forFeature(googleOauthConfig),
    EmailModule,
    TasksModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthStrategy],
})
export class AuthModule {}
