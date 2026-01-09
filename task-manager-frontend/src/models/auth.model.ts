export type UserModel = {
  id: string;
  email: string;
  role: string;
  provider: Provider;
  verified: Date;
  lastActive: Date;
};

export type LoginPayloadModel = {
  email: string;
  password: string;
};

export type RegisterPayloadModel = {
  fullName: string;
} & LoginPayloadModel;

export enum TaskStatus {
  TODO = 'TODO',
  DONE = 'DONE',
}

enum Provider {
  google = 'google',
  credentials = 'credentials',
}
