import { Configuration } from '@buka/nestjs-config'
import { IsIP, IsNumberString, IsOptional, IsString } from 'class-validator'


@Configuration()
export class AppConfig {
  @IsIP()
  host: string = '0.0.0.0'

  @IsNumberString()
  port: string = '8080'

  @IsString()
  storage: string = './storage'

  /**
   * Registry 的域名
   * @example https://example.com/registry
   */
  // @IsUrl({
  //   protocols: ['http', 'https'],
  //   require_protocol: true,
  //   host_whitelist: ['localhost'],
  // })
  @IsString()
  @IsOptional()
  registry: string = 'http://localhost:8080/api/registry'
}
