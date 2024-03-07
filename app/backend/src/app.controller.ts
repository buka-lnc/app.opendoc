import { Controller, Get, Headers } from '@nestjs/common'
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @HealthCheck()
  checkHealth(
    @Headers('Authorization') auth: string
  ): Promise<HealthCheckResult> {
    console.log('🚀 ~ AppController ~ auth:', auth)
    return this.appService.checkHealth()
  }
}
