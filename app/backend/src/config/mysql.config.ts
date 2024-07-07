import { ToNumber } from '@buka/class-transformer-extra'
import { Configuration } from '@buka/nestjs-config'
import { IsBoolean, IsNumber, IsString } from 'class-validator'


@Configuration('mysql')
export class MysqlConfig {
  @IsBoolean()
  debug = false

  @IsString()
  dbName = 'opendoc'

  @IsString()
  host!: string

  @ToNumber()
  @IsNumber({ allowNaN: false })
  port!: number

  @IsString()
  user!: string

  @IsString()
  password!: string

  @IsString()
  timezone? = '+08:00'
}
