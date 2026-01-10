import { Inject, Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import type { Response, NextFunction, CookieOptions } from 'express';

import { RefreshUserRequest } from '@/@types/user';
import { cookieConfig, cookieConfigKey } from '@/routes/auth/config/cookie.config';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserAuthorizationMiddleware implements NestMiddleware {
  private readonly cookieOptions: CookieOptions;
  private readonly authenticatedTokenName: string;

  constructor(
    private prisma: PrismaService,
    @Inject(cookieConfigKey)
    private readonly cookieVarsConfig: ConfigType<typeof cookieConfig>,
  ) {
    this.cookieOptions = {
      httpOnly: false,
      secure: this.cookieVarsConfig.isProd,
      sameSite: this.cookieVarsConfig.sameSite,
      maxAge: this.cookieVarsConfig.cookieExpireMS,
      path: this.cookieVarsConfig.path,
      domain: this.cookieVarsConfig.domain,
    };

    this.authenticatedTokenName = process.env.AUTHENTICATED_TOKEN_NAME!;
  }

  async use(req: RefreshUserRequest, res: Response, next: NextFunction) {
    if (!req.session || !req.session.user) {
      if (req.cookies[this.authenticatedTokenName]) {
        res.clearCookie(this.authenticatedTokenName);
      }
      return next();
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req.session.user.userId },
        omit: { password: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      if (user.lastActive < fiveMinutesAgo) {
        this.prisma.user
          .update({
            where: { id: user.id },
            data: { lastActive: new Date() },
          })
          .catch((err) => {
            console.error('Background update of lastActive failed:', err);
          });

        user.lastActive = new Date();
      }

      req.user = user;
      res.cookie(this.authenticatedTokenName, 'true', this.cookieOptions);

      next();
    } catch (error) {
      console.error(error);
      req.session.destroy(() => {});
      res.clearCookie('connect.sid');

      next();
    }
  }
}
