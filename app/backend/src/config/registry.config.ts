import { Configuration } from '@buka/nestjs-config'
import { IsOptional, IsString } from 'class-validator'


@Configuration('sdk.javascript')
export class JsSdkConfig {
  @IsString()
  register: string = 'https://registry.npmjs.org'

  @IsOptional()
  @IsString()
  authToken?: string

  @IsOptional()
  nameTemplate: string = '${application.code}/${sheet.code}'
}
