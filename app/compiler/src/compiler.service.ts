import compressing from 'compressing'
import { Injectable, Logger } from '@nestjs/common'
import { SdkCreatedEventMessageDataDTO } from './api/backend/components/schemas'
import * as path from 'path'


@Injectable()
export class CompilerService {
  private readonly logger = new Logger(CompilerService.name)
  readonly tempDir = path.resolve('./temp')

  constructor(
  ) {}


  private async unCompress(apiFilesRaw: string): Promise<string> {
    const { temporaryDirectory } = (await import('tempy'))
    const dir = temporaryDirectory()

    const buf = Buffer.from(apiFilesRaw, 'base64')
    await compressing.tgz.uncompress(buf, dir)

    return dir
  }

  async compile(data: SdkCreatedEventMessageDataDTO): Promise<void> {
    const dir = await this.unCompress(data.apiFilesRaw)
    this.logger.debug(`apiFiles had be un compress to ${dir}`)
  }

  // private getTempDir(dto: SdkCreatedEventMessageDataDTO): string {
  //   return path.join(this.tempDir, sdk.name, formatParsedVersion(sdk.version))
  // }


  // async compile(sdk: SdkDTO) {
  //   const dir = this.getTempDir(sdk)

  //   const swagger = await this.getSdkRawDocumentFile(sdk)

  //   const compileDir = path.join(dir, 'compiling')
  //   await fs.ensureDir(compileDir)
  //   await fs.emptyDir(compileDir)

  //   this.logger.debug(`${sdk.fullName} compile dir: ${compileDir}`)
  //   this.logger.debug(`${sdk.fullName} compiling`)
  //   const sheetVersion = await sdk.version.loadOrFail()

  //   await compile({
  //     strict: true,
  //     outdir: compileDir,
  //     document: JSON.parse(swagger),
  //     moduleName: sdk.fullName,
  //     fileNamingStyle: FileNamingStyle.snakeCase,
  //     compiler: Compiler.openapiCore,
  //     project: {
  //       name: sdk.fullName,
  //       version: sheetVersion.version,
  //     },
  //   })


  //   await this.build(sdk, dir)
  //   // await this.publish(sdk, dir)
  //   await this.compress(sdk, dir)
  //   await fs.remove(dir)

  //   await this.em.flush()
  //   this.logger.info(`${sdk.fullName} published`)
  // }
}
