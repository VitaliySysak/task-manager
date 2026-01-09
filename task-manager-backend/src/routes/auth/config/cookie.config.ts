import { registerAs } from '@nestjs/config';

interface CookieConfig {
  isProd: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  authenticatedTokenName: string;
  cookieExpireMS: number;
  domain: string | undefined;
}

export const cookieConfig = registerAs(
  'cookie',
  (): CookieConfig => ({
    isProd: process.env.ENV_TYPE! === 'production',
    sameSite: 'lax',
    path: '/',
    authenticatedTokenName: process.env.AUTHENTICATED_TOKEN_NAME!,
    cookieExpireMS: +process.env.COOKIE_EXPIRE_MS!,
    domain: process.env.DOMAIN_NAME || undefined,
  }),
);

export const cookieConfigKey = cookieConfig.KEY;
