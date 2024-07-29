import { Injectable } from '@nestjs/common'
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus'


@Injectable()
export class AppService {
  constructor(
    private health: HealthCheckService,
  ) {}

  checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([])
  }

  async compile() {

  }
}
