export type User = {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
};

export enum UserRole {
  USER,
  ADMIN,
}

export type ReginsterUser = {
  fullName?: string;
  email: string;
  password: string;
};

export type LoginUser = {
  fullName?: string;
  email: string;
  password: string;
};
