import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisStore } from 'connect-redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { createClient } from 'redis';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);

  const redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));

  await redisClient.connect();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.use(
    cookieParser(),
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: +process.env.COOKIE_EXPIRE_MS!,
        httpOnly: true,
        secure: process.env.ENV_TYPE === 'production',
        domain: process.env.DOMAIN_NAME || undefined,
        sameSite: 'lax',
      },
    }),
  );

  app.enableCors({
    origin: process.env.ENV_TYPE! === 'production' ? [process.env.DOMAIN_NAME!] : true,
    credentials: true,
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('API documentation')
    .setVersion(process.env.GIT_HASH! || 'local')
    .addCookieAuth('connect.sid')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();

  const themeCss = theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK);
  const customCss = themeCss + ' .swagger-ui .auth-wrapper { display: none }';

  SwaggerModule.setup('api/documentation', app, document, {
    customCss: customCss,
  });

  await app.listen(process.env.PORT!);

  const url = `http://localhost:${process.env.PORT!}/api/documentation`;

  console.log('Running on port: ' + process.env.PORT!);
  console.log('Env type: ' + process.env.ENV_TYPE!);
  console.log(`Swagger docs: ${url}`);
}
void bootstrap();
