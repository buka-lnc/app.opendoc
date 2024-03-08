import { Controller, Get, Header, Headers } from '@nestjs/common'
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus'
import { AppService } from './app.service'
import { ApiResponse } from '@nestjs/swagger'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiResponse({
    status: 201,
    headers: {
      'Cache-Control': {
        description: 'no-cache',
        schema: {
          type: 'string',
          example: 'no-cache',
        },
      },
    }
  })
  @HealthCheck()
  checkHealth(
    @Headers('Authorization') auth: string
  ): Promise<HealthCheckResult> {
    console.log('🚀 ~ AppController ~ auth:', auth)
    return this.appService.checkHealth()
  }
}
