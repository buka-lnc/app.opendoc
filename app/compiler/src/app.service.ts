import { Injectable } from '@nestjs/common'
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus'
import { CompilerInfoDTO, CompilerInfoOptionDTO } from './api/backend/components/schemas'
import { version } from '~~/package.json'


@Injectable()
export class AppService {
  constructor(
    private health: HealthCheckService,
  ) {}

  checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([])
  }

  getOptions(): CompilerInfoOptionDTO[] {
    return [
      {
        key: 'register',
        label: 'Npm 源',
        format: 'string',
        value: 'https://registry.npmjs.org',
      },
      {
        key: 'packageNameTemplate',
        label: 'SDK 名称模板',
        description: 'Handlebars语法',
        format: 'string',
        value: '@{{application.code}}/{{sheet.code}}',
      },
    ]
  }

  getInfo(): CompilerInfoDTO {
    return {
      name: '@opendoc/keq-compiler',
      description: 'Compiler for keq',
      author: 'Val-istar-Guo <val.istar.guo@gmail.com>',
      version,
      options: this.getOptions(),
    }
  }

  // private async getTempDir(sdk: Sdk): Promise<string> {
  //   const sheetVersion = await sdk.version.loadOrFail()
  //   return path.join(this.tempDir, sdk.scope, sdk.name, `${sheetVersion.version}`)
  // }


  // async compile() {
  //   const dir = await this.getTempDir(sdk)

  //   if (sdk.compiler === SdkCompiler.openapiCore) {
  //     await this.compileOpenapiCore(sdk, dir)
  //   } else if (sdk.compiler === SdkCompiler.openapiReact) {
  //     await this.compileOpenapiReact(sdk, dir)
  //   // } else if (sdk.compiler === SdkCompiler.openapiVue) {
  //   //   await this.compileOpenapiVue(sdk)
  //   } else if (sdk.compiler === SdkCompiler.asyncapiCore) {
  //     await this.compileAsyncapiCore(sdk, dir)
  //   } else {
  //     throw new BadRequestException(`Unsupported compiler: ${sdk.compiler}`)
  //   }

  //   await this.build(sdk, dir)
  //   // await this.publish(sdk, dir)
  //   await this.compress(sdk, dir)
  //   await fs.remove(dir)

  //   await this.em.flush()
  //   this.logger.info(`${sdk.fullName} published`)
  // }
}
