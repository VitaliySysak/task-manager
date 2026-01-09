import type { CookieOptions, Response } from 'express';

import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Req,
  Res,
  Get,
  UseGuards,
  ConflictException,
  Query,
  UnauthorizedException,
  Logger,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiCookieAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import type { RefreshUserRequest } from '@/@types/user';

import { Status, StatusResponse } from '@/@types/response';
import { AuthGuard } from '@/guards/auth.guard';
import { AuthService } from '@/routes/auth/auth.service';
import { GoogleLoginDto, LoginDto } from '@/routes/auth/dto/login.dto';
import { RegisterDto } from '@/routes/auth/dto/register.dto';
import { GoogleAuthGuard } from '@/routes/auth/guards/google.auth.guard';

import { cookieConfig, cookieConfigKey } from './config/cookie.config';

@Controller({ path: '/auth' })
export class AuthController {
  private readonly logger = new Logger(AuthService.name);
  private readonly cookieOptions: CookieOptions;
  private readonly authenticatedTokenName: string;

  constructor(
    private readonly authService: AuthService,
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

  @Post('/admin/register')
  async adminRegister(@Body() body: RegisterDto): Promise<StatusResponse> {
    try {
      await this.authService.register(body, UserRole.ADMIN);

      return { status: Status.success };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      this.logger.error('adminRegister:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @Post('/register')
  async register(@Body() body: RegisterDto): Promise<StatusResponse> {
    try {
      await this.authService.register(body, UserRole.USER);

      return { status: Status.success };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      this.logger.error('register:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @Post('/login')
  async login(
    @Body() body: LoginDto,
    @Req() req: RefreshUserRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StatusResponse> {
    try {
      const { userId, sessionId } = await this.authService.login(body, req);

      req.session.user = {
        userId,
        sessionId,
      };

      res.cookie(this.authenticatedTokenName, 'true', this.cookieOptions);

      return { status: Status.success };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      this.logger.error('login:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post('/log-out')
  async logOut(@Req() req: RefreshUserRequest, @Res({ passthrough: true }) res: Response): Promise<StatusResponse> {
    try {
      const { sessionId } = req.session.user;

      await this.authService.logOut(sessionId);

      await new Promise<void>((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            const error = err instanceof Error ? err : new Error('Session destroy failed');
            reject(error);
          } else {
            resolve();
          }
        });
      });

      res.clearCookie('connect.sid', { httpOnly: true });
      res.clearCookie(this.authenticatedTokenName, this.cookieOptions);

      return { status: Status.success };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      this.logger.error('logOut:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @Post('/verify-email')
  async verifyEmail(
    @Query('code') code: string,
    @Req() req: RefreshUserRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StatusResponse> {
    try {
      const { userId, sessionId } = await this.authService.verifyEmail(code, req);

      req.session.user = {
        userId,
        sessionId,
      };

      res.cookie(this.authenticatedTokenName, 'true', this.cookieOptions);

      return { status: Status.success };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      this.logger.error('verifyEmail:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: RefreshUserRequest, @Res({ passthrough: true }) res: Response): Promise<void> {
    const user = req.user as GoogleLoginDto;
    try {
      const { userId, sessionId } = await this.authService.loginWithGoogle(user, req);

      req.session.user = {
        userId,
        sessionId,
      };

      res.cookie(this.authenticatedTokenName, 'true', this.cookieOptions);

      res.redirect(process.env.FRONTEND_URL!);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      this.logger.error('googleCallback:', error.stack);
      throw new InternalServerErrorException();
    }
  }
}
