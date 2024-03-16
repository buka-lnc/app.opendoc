import { ApiDocumentFileService } from '~/modules/api-document-file/api-document-file.service'
import * as fs from 'fs-extra'
import * as path from 'path'
import { EnsureRequestContext, EntityManager, MikroORM } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'
import { NpmPackage } from './entity/npm-package.entity'
import { BuildTask } from './entity/build-task.entity'
import { buffer } from 'stream/consumers'
import { API_DOCUMENT_TYPE } from '../api-document/constants/api-document-type.enum'
import { AppConfig } from '~/config/app.config'


@Injectable()
export class PublishPackageService {
  buildTaskId?: string

  constructor(
    @InjectPinoLogger(PublishPackageService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly apiDocumentFileService: ApiDocumentFileService,

    @InjectRepository(ApiDocumentFile)
    private readonly apiDocumentFileRepo: EntityRepository<ApiDocumentFile>,

    @InjectRepository(NpmPackage)
    private readonly npmPackageRepo: EntityRepository<NpmPackage>,

    @InjectRepository(BuildTask)
    private readonly buildTaskRepo: EntityRepository<BuildTask>,
  ) {}

  // TODO: 避免多个实例同时执行清理程序
  @Cron('0 */5 * * * *')
  @EnsureRequestContext()
  async clean() {
    // 自动清理五分钟无心跳的任务
    await this.buildTaskRepo.nativeDelete({
      updatedAt: { $lt: new Date(Date.now() - 1000 * 60 * 5) },
    })
  }


  @Cron('0 */1 * * * *')
  @EnsureRequestContext()
  async sendHeartbeat() {
    if (this.buildTaskId) {
      await this.buildTaskRepo.nativeUpdate(
        { id: this.buildTaskId },
        { updatedAt: new Date() }
      )
    }
  }

  @Cron('0/10 * * * * *')
  @EnsureRequestContext()
  async publishPackage() {
    const npmPackage = await this.npmPackageRepo.findOne(
      { isPublished: false, BuildTask: null },
      { populate: ['apiDocumentFile', 'apiDocumentFile.apiDocument'] }
    )

    if (!npmPackage) {
      return
    }

    const buildTask = this.buildTaskRepo.create({
      npmPackage: npmPackage,
    })

    this.buildTaskId = buildTask.id

    await this.em.persistAndFlush(buildTask)

    const apiDocumentFile = npmPackage.apiDocumentFile.get()

    const stream = await this.apiDocumentFileService.queryRawDocumentFileById(apiDocumentFile.id)
    const buf = await buffer(stream)
    const str = buf.toString('utf8')

    if (apiDocumentFile.apiDocument.$.type === API_DOCUMENT_TYPE.OPEN_API) {
      await this.buildOpenapi(str)
    }

    npmPackage.isPublished = true
    npmPackage.publishedAt = new Date()
    // npmPackage.tarball = 'TODO'
    // npmPackage.integrity = 'TODO'

    await this.em.persistAndFlush(npmPackage)
    this.buildTaskId = undefined
    await this.em.removeAndFlush(buildTask)
  }

  private getFilepath(npmPackage: NpmPackage): string {
    return path.join(path.resolve(this.appConfig.storage), 'registry', npmPackage.scope, npmPackage.name)
  }

  async buildOpenapi(swagger: string) {
    await fs.ensureDir(this.appConfig.storage)


    // const filepath = this.getFilepath(npmPackage)
    console.log('🚀 ~ PublishPackageService ~ buildOpenapi ~ swagger:', swagger)
  }
}
