import type { Request } from 'express';

import { User } from '@prisma/client';
import { Session } from 'express-session';

export type PublicUser = Omit<User, 'password'>;

export interface RefreshUserRequest extends Request {
  session: Session & {
    user: {
      userId: string;
      sessionId: string;
    };
  };
}

export interface UserSession {
  userId: string;
  sessionId: string;
}

export interface UserRequest extends Request {
  user: Omit<User, 'password'>;
}
