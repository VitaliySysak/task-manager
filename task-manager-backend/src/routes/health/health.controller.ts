import { Controller, Get, InternalServerErrorException, Logger } from '@nestjs/common';

import { StatusResponse } from '@/@types/response';
import { HealthService } from '@/routes/health/health.service';

@Controller('/health')
export class HealthController {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly healthService: HealthService) {}

  @Get('/')
  healthCheck(): StatusResponse {
    try {
      const response = this.healthService.getHealth();

      return response;
    } catch (error) {
      this.logger.error('healthCheck:', error.stack);
      throw new InternalServerErrorException();
    }
  }
}
