import { Configuration } from '@buka/nestjs-config'
import { IsBoolean, IsIP, IsNumberString, IsOptional, IsString } from 'class-validator'


@Configuration()
export class AppConfig {
  @IsIP()
  host: string = '0.0.0.0'

  @IsNumberString()
  port: string = '8080'

  /**
   * Registry 的域名
   * @example https://example.com/registry
   */
  @IsString()
  @IsOptional()
  registry: string = 'http://localhost:8080/api/registry'

  @IsBoolean()
  @IsOptional()
  migration: boolean = false
}
