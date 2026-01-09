import { Injectable } from '@nestjs/common';

import { Status, StatusResponse } from '@/@types/response';

@Injectable()
export class HealthService {
  constructor() {}
  getHealth(): StatusResponse {
    return { status: Status.success };
  }
}
