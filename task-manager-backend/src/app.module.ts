import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/routes/auth/auth.module';
import { TasksModule } from '@/routes/tasks/tasks.module';

import { UserAuthorizationMiddleware } from './middleware/user-auth.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './routes/auth/auth.controller';
import { cookieConfig } from './routes/auth/config/cookie.config';
import { HealthController } from './routes/health/health.controller';
import { HealthModule } from './routes/health/health.module';
import { TasksController } from './routes/tasks/tasks.controller';
import { UsersController } from './routes/users/users.controller';
import { UserModule } from './routes/users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, TasksModule, HealthModule, ConfigModule.forFeature(cookieConfig)],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthorizationMiddleware)
      .forRoutes(TasksController, AuthController, UsersController, HealthController);
  }
}
