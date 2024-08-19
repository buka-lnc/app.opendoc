import { Configuration } from '@buka/nestjs-config'
import { IsInt, IsNumber, IsString } from 'class-validator'


@Configuration('plugin')
export class PluginConfig {
  /**
   * Timeout for plugin connections
   */
  @IsInt()
  ttl: number = 100

  @IsString()
  logDirectory: string = './.opendoc/plugin-logs'

  // 允许接口查询的最大日志大小
  @IsNumber()
  maxLogSizeForQuery: number = 1024 * 1024 * 10
}
