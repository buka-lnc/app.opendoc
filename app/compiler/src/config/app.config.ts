import { Configuration } from '@buka/nestjs-config'
import { IsIP, IsNumberString } from 'class-validator'


@Configuration()
export class AppConfig {
  @IsIP()
  host: string = '0.0.0.0'

  @IsNumberString()
  port: string = '8081'
}
