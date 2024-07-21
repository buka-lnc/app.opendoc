import { OpendocOptions } from '~/modules/option/types/opendoc-options'

export const opendocOptions: OpendocOptions = {
  registryUrl: 'https://registry.npmjs.org/',
  registryAuthToken: '',

  sdkNameTemplate: '@{{application.name}}/{{sheet.name}}',
}
