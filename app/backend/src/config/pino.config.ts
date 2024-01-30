import { ToBoolean } from '@buka/class-transformer-extra'
import { Configuration } from '@buka/nestjs-config'
import { IsIn } from 'class-validator'

/**
 * nestjs-pino 日志模块配置
 */
@Configuration('pino')
export class PinoConfig {
  @ToBoolean()
  pretty: boolean = false

  @IsIn(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
  level: string = 'info'
}
