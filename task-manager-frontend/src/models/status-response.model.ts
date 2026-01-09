export type StatusResponseModel = {
  status: Status;
};

export enum Status {
  success = 'success',
  failure = 'failure',
}
