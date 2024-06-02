import { EnsureRequestContext, EntityManager, MikroORM } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from '~/config/app.config'
import { Sdk } from './entity/sdk.entity'
import { SdkPublishLock } from './entity/sdk-publish-lock.entity'
import { SdkStatus } from './constant/sdk-status'
import { CompilerService } from './compiler.service'


@Injectable()
export class PublishService {
  publishLockId?: string

  constructor(
    @InjectPinoLogger(PublishService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly compilerService: CompilerService,

    @InjectRepository(Sdk)
    private readonly sdkRepo: EntityRepository<Sdk>,

    @InjectRepository(SdkPublishLock)
    private readonly sdkPublishLockRepo: EntityRepository<SdkPublishLock>,
  ) {}

  // TODO: 避免多个实例同时执行清理程序
  @Cron('0 */5 * * * *')
  @EnsureRequestContext()
  async clean() {
    // 自动清理五分钟无心跳的任务
    const locks = await this.sdkPublishLockRepo.find({
      updatedAt: { $lt: new Date(Date.now() - 1000 * 60 * 5) },
    })

    this.em.remove(locks)

    const sdks = await this.sdkRepo.find({
      sdkPublishLock: { $in: locks },
    })

    for (const sdk of sdks) {
      sdk.status = SdkStatus.pending
      this.em.persist(sdk)
    }

    await this.em.flush()
  }


  @Cron('0 */1 * * * *')
  @EnsureRequestContext()
  async sendHeartbeat() {
    if (this.publishLockId) {
      await this.sdkPublishLockRepo.nativeUpdate(
        { id: this.publishLockId },
        { updatedAt: new Date() }
      )
    }
  }

  @Cron('0/10 * * * * *')
  @EnsureRequestContext()
  async publishPackage() {
    // 存在正在构建的SDK，跳过
    if (this.publishLockId) return

    const sdk = await this.sdkRepo.findOne(
      { status: SdkStatus.pending, sdkPublishLock: null },
      {
        populate: ['apiFile', 'apiFile.sheet'],
      }
    )

    // 无待构建 SDK
    if (!sdk) return

    const lock = this.sdkPublishLockRepo.create({ sdk: sdk.id })
    sdk.status = SdkStatus.compiling

    try {
      this.em.persist(sdk)
      this.em.persist(lock)
      await this.em.flush()

      this.publishLockId = lock.id

      this.logger.debug('PUBLISHING')

      await this.compilerService.compile(sdk)

      sdk.status = SdkStatus.published
      sdk.publishedAt = new Date()

      await this.em.persistAndFlush(sdk)
    } catch (err) {
      this.logger.error(err)
      throw err
    } finally {
      this.publishLockId = undefined
      await this.em.removeAndFlush(lock)
    }
  }
}
