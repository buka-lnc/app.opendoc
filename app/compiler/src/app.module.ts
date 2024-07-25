import { ConfigModule } from '@buka/nestjs-config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppConfig } from './config/app.config'
import { PinoConfig } from './config/pino.config'
import { AppGateway } from './app.gateway'


@Module({
  imports: [
    ConfigModule.register({
      isGlobal: true,
      providers: [AppConfig, PinoConfig],
    }),

    ConfigModule.inject(PinoConfig, LoggerModule, (config) => ({
      pinoHttp: {
        transport: config.pretty ? { target: 'pino-pretty' } : undefined,
        level: config.level,
      },
    })),


    EventEmitterModule.forRoot(),

    TerminusModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
