import { ConfigModule } from '@buka/nestjs-config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppConfig } from './config/app.config'
import { PinoConfig } from './config/pino.config'
import { ApplicationModule } from './modules/application/application.module'
import { ExampleModule } from './modules/example/example.module'
import { ScheduleModule } from '@nestjs/schedule'
import { StorageConfig } from './config/storage.config'
import { MysqlConfig } from './config/mysql.config'
import { StorageModule } from './modules/storage/storage.module'
import { SheetModule } from './modules/sheet/sheet.module'
import { ApiFileModule } from './modules/api-file/api-file.module'
import { SheetVersionModule } from './modules/sheet-version/sheet-version.module'
import { OptionModule } from './modules/option/option.module'
import { SdkModule } from './modules/sdk/sdk.module'
import { PluginModule } from './modules/plugin/plugin.module'
import { PluginConfig } from './config/plugin.config'


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.register({
      isGlobal: true,
      providers: [AppConfig, PinoConfig, StorageConfig, MysqlConfig, PluginConfig],
    }),

    ConfigModule.inject(PinoConfig, LoggerModule, (config) => ({
      pinoHttp: {
        transport: config.pretty ? { target: 'pino-pretty' } : undefined,
        level: config.level,
      },
    })),


    MikroOrmModule.forRoot(),

    EventEmitterModule.forRoot(),

    TerminusModule,

    ExampleModule,
    StorageModule,
    ApplicationModule,
    SheetModule,
    SheetVersionModule,
    ApiFileModule,
    SdkModule,
    OptionModule,
    PluginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
