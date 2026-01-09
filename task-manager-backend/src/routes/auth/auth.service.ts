import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Provider, User, UserRole } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { Request } from 'express';

import { UserSession } from '@/@types/user';
import { EmailService } from '@/email/email.service';
import { PrismaService } from '@/prisma/prisma.service';
import { GoogleLoginDto, LoginDto } from '@/routes/auth/dto/login.dto';
import { RegisterDto } from '@/routes/auth/dto/register.dto';
import { TasksService } from '@/routes/tasks/tasks.service';

import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class AuthService {
  private readonly cookieExpireMS: number;

  constructor(
    private prisma: PrismaService,
    private tasksService: TasksService,
    private readonly emailService: EmailService,
  ) {
    this.cookieExpireMS = +process.env.COOKIE_EXPIRE_MS!;
  }

  async findByUserId(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  async validateUser(email: string, password: string): Promise<ValidateUserDto> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { userId: user.id };
  }

  async register(newUser: RegisterDto, role: UserRole): Promise<void> {
    const { email, password } = newUser;

    const isUserExist = await this.findByEmail(email);

    if (isUserExist) {
      if (!isUserExist.verified) {
        throw new UnauthorizedException('Email not confirmed');
      }
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const hashedPassword = await hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        role,
        email,
        password: hashedPassword,
      },
    });

    if (!user.email) {
      throw new InternalServerErrorException('Failed to create user');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.verificationCode.create({
      data: {
        code,
        userId: user.id,
      },
    });

    await this.emailService.sendVerificationEmail(user.email, code);

    return;
  }

  async verifyEmail(code: string, req: Request): Promise<UserSession> {
    if (!code) {
      throw new BadRequestException('Code is missing');
    }

    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: {
        code,
      },
    });

    if (!verificationCode?.userId) {
      throw new UnauthorizedException('Invalid code');
    }

    const user = await this.prisma.user.update({
      where: {
        id: verificationCode.userId,
      },
      data: {
        provider: Provider.credentials,
        verified: new Date(),
      },
    });

    await this.prisma.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    });

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.socket.remoteAddress,
        expiresAt: new Date(Date.now() + this.cookieExpireMS),
      },
    });

    await this.prisma.profile.create({
      data: {
        userId: user.id,
      },
    });

    await this.prisma.achivement.create({
      data: {
        userId: user.id,
      },
    });

    const initTask = {
      title: 'task example',
      description: 'a little description for this task',
    };

    await this.tasksService.create(initTask, user);

    return { userId: user.id, sessionId: session.id };
  }

  async login(user: LoginDto, req: Request): Promise<UserSession> {
    const { email, password } = user;
    const { userId } = await this.validateUser(email, password);

    const session = await this.prisma.session.create({
      data: {
        userId,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.socket.remoteAddress,
        expiresAt: new Date(),
      },
    });

    return {
      userId,
      sessionId: session.id,
    };
  }

  async logOut(sessionId: string): Promise<void> {
    await this.prisma.session.delete({ where: { id: sessionId } });
  }

  async validateGoogleUser(googleUser: GoogleLoginDto): Promise<User> {
    const { fullName, avatarUrl, email, password, providerId } = googleUser;

    const isUserExist = await this.findByEmail(googleUser.email);

    if (isUserExist) {
      await this.prisma.user.update({
        where: {
          id: isUserExist.id,
        },
        data: { provider: Provider.google, providerId },
      });

      return isUserExist;
    }

    const user = await this.prisma.user.create({
      data: { email, password, provider: Provider.google, verified: new Date() },
    });

    await this.prisma.profile.create({
      data: {
        fullName,
        avatarUrl,
        userId: user.id,
      },
    });

    await this.prisma.achivement.create({
      data: {
        userId: user.id,
      },
    });

    const initTask = {
      title: 'task example',
      description: 'a description for this task',
    };

    await this.tasksService.create(initTask, user);

    return user;
  }

  async loginWithGoogle(googleUser: GoogleLoginDto, req: Request): Promise<UserSession> {
    const { email } = googleUser;

    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.socket.remoteAddress,
        expiresAt: new Date(Date.now() + this.cookieExpireMS),
      },
    });

    return {
      userId: user.id,
      sessionId: session.id,
    };
  }

  // async loginGoogleCalendar(data: CalendarDto, hashedRefreshToken: string) {
  //   const { googleCalendarRefreshToken } = data;

  //   await this.prisma.session.update({
  //     where: { hashedRefreshToken },
  //     data: {
  //       googleCalendarRefreshToken,
  //     },
  //   });

  //   return googleCalendarRefreshToken;
  // }

  // async calendarRefresh(googleCalendarRefreshToken: string) {
  //   const params = new URLSearchParams();
  //   params.append('client_id', process.env.GOOGLE_ID!);
  //   params.append('client_secret', process.env.GOOGLE_SECRET!);
  //   params.append('refresh_token', googleCalendarRefreshToken);
  //   params.append('grant_type', 'refresh_token');

  //   const response = (await axios.post('https://oauth2.googleapis.com/token', params)).data;

  //   return response['access_token'];
  // }
}
