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


const exec = promisify(childProcess.exec)

@Injectable()
export class CompilerService {
  constructor(
    @InjectPinoLogger(CompilerService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly apiDocumentFileService: ApiDocumentFileService,
    private readonly sdkService: SdkService,
  ) {}

  async compile(sdk: Sdk): Promise<void> {
    if (sdk.compiler === SdkCompiler.openapiCore) {
      await this.compileOpenapiCore(sdk)
    } else if (sdk.compiler === SdkCompiler.openapiReact) {
      await this.compileOpenapiReact(sdk)
    // } else if (sdk.compiler === SdkCompiler.openapiVue) {
    //   await this.compileOpenapiVue(sdk)
    } else {
      throw new BadRequestException(`Unsupported compiler: ${sdk.compiler}`)
    }
  }

  private getCompileDir(sdk: Sdk): string {
    return path.join(path.resolve(this.appConfig.storage), 'compiling', sdk.scope, sdk.name, `${sdk.version}`)
  }

  private async getSdkRawDocumentFile(sdk: Sdk): Promise<string> {
    const apiDocumentFile = await sdk.apiDocumentFile.loadOrFail()

    const stream = await this.apiDocumentFileService.queryRawDocumentFileById(apiDocumentFile.id)
    const buf = await buffer(stream)
    return buf.toString('utf8')
  }

  async compileOpenapiCore(sdk: Sdk) {
    const swagger = await this.getSdkRawDocumentFile(sdk)

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
      compiler: Compiler.openapiCore,
      project: {
        name: sdk.fullName,
        version: sdk.version,
      },
    })

    const tarballFilepath = this.sdkService.getTarballFilepath(sdk)
    await fs.ensureDir(path.dirname(tarballFilepath))

    this.logger.debug(`${sdk.fullName} building`)
    try {
      await exec('npm install --production=false && npm run build', { cwd: compileDir })
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

  async compileOpenapiReact(sdk: Sdk) {
    console.log('🚀 ~ CompilerService ~ compileOpenapiReact ~ sdk:', sdk)
    // sleep 5s
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const swagger = await this.getSdkRawDocumentFile(sdk)

    const compileDir = this.getCompileDir(sdk)
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
          core: `@${sdk.scope}/${apiDocument.code}`,
        },
      },
    })

    const tarballFilepath = this.sdkService.getTarballFilepath(sdk)
    await fs.ensureDir(path.dirname(tarballFilepath))

    this.logger.debug(`${sdk.fullName} building`)
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

  // async compileOpenapiVue(sdk: Sdk) {
  //   console.log('🚀 ~ CompilerService ~ compileOpenapiVue ~ sdk:', sdk)
  //   // sleep 5s
  //   await new Promise((resolve) => setTimeout(resolve, 5000))
  // }
}
