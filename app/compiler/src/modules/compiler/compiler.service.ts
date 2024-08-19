import * as path from 'path'
import * as fs from 'fs-extra'
import * as childProcess from 'child_process'
import compressing from 'compressing'
import { Injectable } from '@nestjs/common'
import { compile, Compiler, FileNamingStyle } from '@opendoc/sdk'
import { promisify } from 'util'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { version } from '~~/package.json'
import { SdkCreatedPluginEventMessageData } from '~/api/backend/components/schemas'
import { formatParsedVersion } from '~/utils/format-parsed-version'


const exec = promisify(childProcess.exec)
@Injectable()
export class CompilerService {
  constructor(
    @InjectPinoLogger(CompilerService.name)
    private readonly logger: PinoLogger
  ) {}

  readonly tempDir = path.resolve('./.opendoc/temp')

  metadata = {
    apiVersion: '^1',
    name: '@opendoc/typescript-sdk-compiler',
    description: '将 Openapi 编译成通用的 Javascript SDK',
    author: 'Val-istar-Guo <val.istar.guo@gmail.com>',
    version,
    options: [
      {
        key: 'registryUrl',
        label: 'Npm 源',
        format: 'string',
        value: 'https://registry.npmjs.org',
      },
      {
        key: 'registryAccessToken',
        label: 'Npm 源访问令牌',
        format: 'string',
        value: '',
      },
      {
        key: 'packageNameTemplate',
        label: 'SDK 名称模板',
        description: 'Handlebars语法',
        format: 'string',
        value: '@{{application.code}}/{{sheet.code}}',
      },
    ],
  }


  private async unCompress(apiFilesRaw: string): Promise<string> {
    const { temporaryDirectory } = (await import('tempy'))
    const dir = temporaryDirectory()

    const buf = Buffer.from(apiFilesRaw, 'base64')
    await compressing.tgz.uncompress(buf, dir)

    return dir
  }

  async compile(data: SdkCreatedPluginEventMessageData): Promise<void> {
    const { sdk, version } = data
    const apiFilesDir = await this.unCompress(data.apiFilesRaw)

    const openapiFilepath = path.join(apiFilesDir, 'openapi.json')
    if (!await fs.exists(openapiFilepath)) {
      throw new Error(`Cannot compile ${sdk.name} SDK: openapi.json not found`)
    }
    const swagger = await fs.readJson(openapiFilepath)

    this.logger.debug(`apiFiles had be uncompressed to ${apiFilesDir}`)

    const { temporaryDirectory } = (await import('tempy'))
    const compileDir = temporaryDirectory()

    this.logger.debug(`Compile ${sdk.name} SDK to: ${compileDir}`)

    await compile({
      strict: true,
      outdir: compileDir,
      document: swagger,
      moduleName: sdk.name,
      fileNamingStyle: FileNamingStyle.snakeCase,
      compiler: Compiler.openapiCore,
      project: {
        name: sdk.name,
        version: formatParsedVersion(version),
      },
    })

    this.logger.debug(`Build ${sdk.name} SDK`)
    await this.build(compileDir)

    this.logger.debug(`Publish ${sdk.name} SDK`)
    await this.publish(compileDir, data)
    this.logger.debug(`${sdk.name} SDK Published`)
  }

  async build(dir: string): Promise<void> {
    try {
      await exec('npm install --production=false --legacy-peer-deps', { cwd: dir })
      await exec('npm run build', { cwd: dir })
    } catch (e) {
      if (e instanceof Error) {
        if ('stdout' in e) {
          this.logger.info(e.stdout)
        }

        if ('stderr' in e) {
          this.logger.error(e.stderr)
        }
      }

      throw e
    }
  }

  async publish(compileDir: string, data: SdkCreatedPluginEventMessageData): Promise<void> {
    const npmrcFilepath = path.join(compileDir, '.npmrc')

    this.logger.debug('🚀 ~ CompilerService ~ publish ~ data.compiler.options:', JSON.stringify(data.plugin.options))

    // register url
    const registerUrlOption = data.plugin.options.find((option) => option.key === 'registryUrl')
    if (!registerUrlOption || !registerUrlOption.value) {
      throw new Error('Cannot publish SDK: registryUrl option not found')
    }
    const registryUrl = registerUrlOption.value.replace(/\/$/, '')
    await fs.appendFile(npmrcFilepath, `\nregistry=${registryUrl}`)

    // register access token
    const registerAccessTokenOption = data.plugin.options.find((option) => option.key === 'registryAccessToken')
    if (registerAccessTokenOption && registerAccessTokenOption.value) {
      const registryHost = registryUrl.replace(/^https?:\/\//, '')
      await fs.appendFile(npmrcFilepath, `\n//${registryHost}/:_authToken=${registerAccessTokenOption.value}\n`)
    }

    try {
      await exec(`npm publish --registry ${registryUrl}`, { cwd: compileDir })
    } catch (e) {
      if (e instanceof Error) {
        if ('stdout' in e) {
          this.logger.info(e.stdout)
        }

        if ('stderr' in e) {
          this.logger.error(e.stderr)
        }
      }

      throw e
    }
  }
}
