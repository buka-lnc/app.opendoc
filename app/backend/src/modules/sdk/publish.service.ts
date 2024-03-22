import { ApiDocumentFileService } from '~/modules/api-document-file/api-document-file.service'
import * as fs from 'fs-extra'
import * as crypto from 'crypto'
import * as childProcess from 'child_process'
import * as path from 'path'
import { EnsureRequestContext, EntityManager, MikroORM } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { buffer } from 'stream/consumers'
import { API_DOCUMENT_TYPE } from '../api-document/constants/api-document-type.enum'
import { AppConfig } from '~/config/app.config'
import { FileNamingStyle, Filetype, compile } from '@opendoc/sdk'
import compressing from 'compressing'
import { Sdk } from './entity/sdk.entity'
import { SdkPublishLock } from './entity/sdk-publish-lock.entity'
import { SdkService } from './sdk.service'
import { promisify } from 'util'
import { SdkStatus } from './constant/sdk-status'

const exec = promisify(childProcess.exec)

@Injectable()
export class PublishService {
  publishLockId?: string

  constructor(
    @InjectPinoLogger(PublishService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly apiDocumentFileService: ApiDocumentFileService,
    private readonly sdkService: SdkService,

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
      { populate: ['apiDocumentFile', 'apiDocumentFile.apiDocument'] }
    )

    // 无待构建 SDK
    if (!sdk) return

    const lock = this.sdkPublishLockRepo.create({
      sdk: sdk.id,
    })

    this.publishLockId = lock.id

    try {
      await this.em.persistAndFlush(lock)

      const apiDocumentFile = sdk.apiDocumentFile.get()

      const stream = await this.apiDocumentFileService.queryRawDocumentFileById(apiDocumentFile.id)
      const buf = await buffer(stream)
      const str = buf.toString('utf8')

      if (apiDocumentFile.apiDocument.$.type === API_DOCUMENT_TYPE.OPEN_API) {
        await this.buildOpenapi(sdk, str)
      }

      sdk.status = SdkStatus.published
      sdk.publishedAt = new Date()

      await this.em.persistAndFlush(sdk)
      await this.em.removeAndFlush(lock)
      this.publishLockId = undefined
    } catch (err) {
      this.publishLockId = undefined

      this.logger.error(err)
      throw err
    }
  }

  private getCompileDir(sdk: Sdk): string {
    return path.join(path.resolve(this.appConfig.storage), 'compiling', sdk.scope, sdk.name, `${sdk.version}`)
  }

  async buildOpenapi(sdk: Sdk, swagger: string) {
    const compileDir = this.getCompileDir(sdk)
    await fs.ensureDir(compileDir)
    await fs.emptyDir(compileDir)

    this.logger.debug(`${sdk.fullName} compiling`)

    await compile({
      strict: true,
      outdir: compileDir,
      document: JSON.parse(swagger),
      moduleName: sdk.fullName,
      fileNamingStyle: FileNamingStyle.snakeCase,
      filetype: Filetype.openapi,
      project: {
        name: sdk.fullName,
        version: sdk.version,
      },
    })

    const tarballFilepath = this.sdkService.getTarballFilepath(sdk)
    await fs.ensureDir(path.dirname(tarballFilepath))

    this.logger.debug(`${sdk.fullName} building`)
    try {
      await exec('npm install && npm run build', { cwd: compileDir })
    } catch (e) {
      if (e instanceof Error) {
        if ('stdout' in e) {
          console.log(e.stdout)
        }
        if ('stderr' in e) {
          console.log(e.stderr)
        }
      }

      throw e
    }

    this.logger.debug(`${sdk.fullName} compressing`)
    await compressing.tgz.compressDir(compileDir, tarballFilepath)

    const buf = await fs.readFile(tarballFilepath)
    const integrity = crypto
      .createHash('sha512')
      .update(buf)
      .digest('base64')

    sdk.tarball = `/@${sdk.scope}/${sdk.name}/-/${sdk.name}-${sdk.version}.tgz`
    sdk.integrity = `sha512-${integrity}`
    this.logger.info(`${sdk.fullName} published`)

    this.em.persist(sdk)
  }
}
