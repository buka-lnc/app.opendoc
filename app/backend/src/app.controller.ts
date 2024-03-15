import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @HealthCheck()
  checkHealth(): Promise<HealthCheckResult> {
    return this.appService.checkHealth()
  }
}
