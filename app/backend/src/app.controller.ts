import { Controller, Get, Header, Headers } from '@nestjs/common'
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus'
import { AppService } from './app.service'
import { ApiResponse } from '@nestjs/swagger'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @HealthCheck()
  checkHealth(): Promise<HealthCheckResult> {
    return this.appService.checkHealth()
  }
}
