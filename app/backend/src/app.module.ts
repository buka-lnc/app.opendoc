import { ConfigModule } from '@buka/nestjs-config'
import { MySqlDriver } from '@mikro-orm/mysql'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { BadRequestException, Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TerminusModule } from '@nestjs/terminus'
import { LoggerModule } from 'nestjs-pino'
import * as util from 'util'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppConfig } from './config/app.config'
import { MysqlConfig } from './config/mysql.config'
import { PinoConfig } from './config/pino.config'
import { ApiDocumentModule } from './modules/api-document/api-document.module'
import { ApplicationModule } from './modules/application/application.module'
import { ExampleModule } from './modules/example/example.module'
import { RegistryModule } from './modules/registry/registry.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.register({
      isGlobal: true,
      providers: [AppConfig],
    }),

    ConfigModule.inject(PinoConfig, LoggerModule, (config) => ({
      pinoHttp: {
        transport: config.pretty && { target: 'pino-pretty' },
        level: config.level,
      },
    })),


    ConfigModule.inject(MysqlConfig, MikroOrmModule, (config) => ({
      ...config,
      entities: ['dist/**/*.entity.js'],
      driver: MySqlDriver,
      findOneOrFailHandler: (entityName, where) => new BadRequestException(`Failed: ${entityName} in ${util.inspect(where)}`),
    })),

    ScheduleModule.forRoot(),

    TerminusModule,
    ApiDocumentModule,
    ApplicationModule,
    ExampleModule,
    RegistryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
