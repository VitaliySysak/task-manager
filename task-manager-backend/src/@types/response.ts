export type StatusResponse = {
  status: Status;
};

export enum Status {
  success = 'success',
  failure = 'failure',
}
