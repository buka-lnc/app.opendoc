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
import { ApiDocumentModule } from './modules/api-document/api-document.module'
import { ApplicationModule } from './modules/application/application.module'
import { ExampleModule } from './modules/example/example.module'
import { RegistryModule } from './modules/registry/registry.module'
import { ApiDocumentFileModule } from './modules/api-document-file/api-document-file.module'
import { ScheduleModule } from '@nestjs/schedule'
import { StorageConfig } from './config/storage.config'
import { MysqlConfig } from './config/mysql.config'
import { StorageModule } from './modules/storage/storage.module'


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.register({
      isGlobal: true,
      providers: [AppConfig, PinoConfig, StorageConfig, MysqlConfig],
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

    StorageModule,
    ApiDocumentModule,
    ApplicationModule,
    ApiDocumentFileModule,
    ExampleModule,
    RegistryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
