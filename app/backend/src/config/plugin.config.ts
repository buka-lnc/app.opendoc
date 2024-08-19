import { Configuration } from '@buka/nestjs-config'
import { IsInt } from 'class-validator'


@Configuration('plugin')
export class PluginConfig {
  /**
   * 插件连接超时时间
   */
  @IsInt()
  ttl: number = 100
}
