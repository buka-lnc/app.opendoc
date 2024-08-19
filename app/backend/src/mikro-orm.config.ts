import { ConfigModule } from '@buka/nestjs-config'
import * as util from 'util'
import { FlushMode, MySqlDriver, defineConfig } from '@mikro-orm/mysql'
import { MysqlConfig } from './config/mysql.config'
import { Migrator } from '@mikro-orm/migrations'
import { BadRequestException } from '@nestjs/common'


export default (async function loadConfig() {
  await ConfigModule.preload({
    providers: [MysqlConfig],
  })

  const config = await ConfigModule.get(MysqlConfig)

  return defineConfig({
    ...config,
    entities: ['dist/**/*.entity.js'],
    flushMode: FlushMode.COMMIT,
    extensions: [Migrator],
    serialization: {
      forceObject: true,
    },
    migrations: {
      path: 'dist/src/migrations',
      pathTs: 'src/migrations',
    },
    driver: MySqlDriver,
    findOneOrFailHandler: (entityName, where) => new BadRequestException(`Cannot find ${entityName} where ${util.inspect(where)}`),
  })
})()

