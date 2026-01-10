import { Injectable } from '@nestjs/common';

import { PublicUser } from '@/@types/user';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<PublicUser[]> {
    const users = await this.prisma.user.findMany({ omit: { password: true } });

    return users;
  }
}
