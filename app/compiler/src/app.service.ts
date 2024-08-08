import { Injectable } from '@nestjs/common'
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus'
import { CompilerInformation } from './api/backend/components/schemas'
import { version } from '~~/package.json'


@Injectable()
export class AppService {
  constructor(
    private health: HealthCheckService,
  ) {}

  checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([])
  }


  getInformation(): CompilerInformation {
    return {
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
  }
}
