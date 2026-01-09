import { Controller, ForbiddenException, Get, InternalServerErrorException, Logger, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { PublicUser } from '@/@types/user';
import { Roles } from '@/decorators/roles.decorator';
import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';

import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersService: UsersService) {}

  @ApiCookieAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/all')
  async getAll(): Promise<PublicUser[]> {
    try {
      const users = await this.usersService.getAll();

      return users;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }
      this.logger.error('getAll:', error.stack);
      throw new InternalServerErrorException();
    }
  }
}
