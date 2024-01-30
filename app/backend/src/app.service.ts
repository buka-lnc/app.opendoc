import { MikroORM } from '@mikro-orm/core'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus'

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly orm: MikroORM,
    private health: HealthCheckService,
  ) {}

  checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([])
  }

  async onModuleInit() {
    await this.orm.schema.refreshDatabase()
  }
}
