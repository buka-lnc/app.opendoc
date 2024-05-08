import { BadRequestException, Injectable } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as crypto from 'crypto'
import * as childProcess from 'child_process'
import compressing from 'compressing'
import { promisify } from 'util'
import { buffer } from 'stream/consumers'
import { Sdk } from './entity/sdk.entity'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from '~/config/app.config'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { Compiler, FileNamingStyle, compile } from '@opendoc/sdk'
import { ApiDocumentFileService } from '../api-document-file/api-document-file.service'
import { SdkService } from './sdk.service'
import { SdkCompiler } from './constant/sdk-compiler'
import { StorageService } from '../storage/storage.service'
import { StorageConfig } from '~/config/storage.config'


const exec = promisify(childProcess.exec)

@Injectable()
export class CompilerService {
  readonly tempDir = path.resolve('./temp')

  constructor(
    @InjectPinoLogger(CompilerService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly storageConfig: StorageConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,


    private readonly storageService: StorageService,
    private readonly apiDocumentFileService: ApiDocumentFileService,
    private readonly sdkService: SdkService,
  ) {}

  private getTempDir(sdk: Sdk): string {
    return path.join(this.tempDir, sdk.scope, sdk.name, `${sdk.version}`)
  }

  async compile(sdk: Sdk): Promise<void> {
    this.logger.info(`🚀 ~ CompilerService ~ compile ~ sdk: ${JSON.stringify(sdk, null, 2)}`)
    const dir = this.getTempDir(sdk)

    if (sdk.compiler === SdkCompiler.openapiCore) {
      await this.compileOpenapiCore(sdk, dir)
    } else if (sdk.compiler === SdkCompiler.openapiReact) {
      await this.compileOpenapiReact(sdk, dir)
    // } else if (sdk.compiler === SdkCompiler.openapiVue) {
    //   await this.compileOpenapiVue(sdk)
    } else if (sdk.compiler === SdkCompiler.asyncapiCore) {
      await this.compileAsyncapiCore(sdk, dir)
    } else {
      throw new BadRequestException(`Unsupported compiler: ${sdk.compiler}`)
    }

    await this.build(sdk, dir)
    await this.compress(sdk, dir)
    // await fs.remove(dir)

    await this.em.flush()
    this.logger.info(`${sdk.fullName} published`)
  }

  async build(sdk: Sdk, dir: string): Promise<void> {
    this.logger.debug(`${sdk.fullName} building`)
    const compileDir = path.join(dir, 'compiling')

    try {
      await exec('npm install --production=false --legacy-peer-deps && npm run build', { cwd: compileDir })
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
  }

  async compress(sdk: Sdk, dir: string): Promise<void> {
    this.logger.debug(`${sdk.fullName} compressing`)
    // const tempDir = this.getTempDir(sdk)
    const compileDir = path.join(dir, 'compiling')

    const tarballFilepath = path.join(dir, 'tarball.tgz')
    await fs.ensureDir(path.dirname(tarballFilepath))
    await compressing.tgz.compressDir(compileDir, tarballFilepath)

    const buf = await fs.readFile(tarballFilepath)
    const integrity = crypto
      .createHash('sha512')
      .update(buf)
      .digest('base64')
    await this.sdkService.uploadTarball(sdk, buf)

    sdk.tarball = `/@${sdk.scope}/${sdk.name}/-/${sdk.name}-${sdk.version}.tgz`
    sdk.integrity = `sha512-${integrity}`
    this.em.persist(sdk)
  }

  private async getSdkRawDocumentFile(sdk: Sdk): Promise<string> {
    const apiDocumentFile = await sdk.apiDocumentFile.loadOrFail()

    this.logger.debug('before create stream')
    const stream = await this.apiDocumentFileService.queryRawDocumentFileById(apiDocumentFile.id)
    this.logger.debug('after create stream')
    const buf = await buffer(stream)
    return buf.toString('utf8')
  }

  async compileOpenapiCore(sdk: Sdk, dir: string) {
    // this.logger.info()
    const swagger = await this.getSdkRawDocumentFile(sdk)
    console.log('🚀 ~ CompilerService ~ compileOpenapiCore ~ swagger:', swagger)

    const compileDir = path.join(dir, 'compiling')
    await fs.ensureDir(compileDir)
    await fs.emptyDir(compileDir)

    this.logger.debug(`${sdk.fullName} compiling`)

    await compile({
      strict: true,
      outdir: compileDir,
      document: JSON.parse(swagger),
      moduleName: sdk.fullName,
      fileNamingStyle: FileNamingStyle.snakeCase,
      compiler: Compiler.openapiCore,
      project: {
        name: sdk.fullName,
        version: sdk.version,
      },
    })
  }

  async compileOpenapiReact(sdk: Sdk, dir: string) {
    const swagger = await this.getSdkRawDocumentFile(sdk)

    const compileDir = path.join(dir, 'compiling')
    await fs.ensureDir(compileDir)
    await fs.emptyDir(compileDir)

    this.logger.debug(`${sdk.fullName} compiling`)

    const apiDocument = await sdk.apiDocument.loadOrFail()

    await compile({
      strict: true,
      outdir: compileDir,
      document: JSON.parse(swagger),
      moduleName: sdk.fullName,
      fileNamingStyle: FileNamingStyle.snakeCase,
      compiler: Compiler.openapiReact,
      project: {
        name: sdk.fullName,
        version: sdk.version,
        dependencies: {
          core: {
            name: `@${sdk.scope}/${apiDocument.code}`,
            version: sdk.version,
          },
        },
      },
    })
  }

  // async compileOpenapiVue(sdk: Sdk) {
  //   console.log('🚀 ~ CompilerService ~ compileOpenapiVue ~ sdk:', sdk)
  //   // sleep 5s
  //   await new Promise((resolve) => setTimeout(resolve, 5000))
  // }

  async compileAsyncapiCore(sdk: Sdk, dir: string) {
    const file = await this.getSdkRawDocumentFile(sdk)

    const compileDir = path.join(dir, 'compiling')
    await fs.ensureDir(compileDir)
    await fs.emptyDir(compileDir)

    this.logger.debug(`${sdk.fullName} compiling`)

    const apiDocument = await sdk.apiDocument.loadOrFail()

    await compile({
      strict: true,
      outdir: compileDir,
      document: JSON.parse(file),
      moduleName: sdk.fullName,
      fileNamingStyle: FileNamingStyle.snakeCase,
      compiler: Compiler.asyncapiCore,
      project: {
        name: sdk.fullName,
        version: sdk.version,
        dependencies: {
          core: {
            name: `@${sdk.scope}/${apiDocument.code}`,
            version: sdk.version,
          },
        },
      },
    })
  }
}
