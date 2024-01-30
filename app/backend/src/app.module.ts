import { ConfigModule } from '@buka/nestjs-config'
import { MySqlDriver } from '@mikro-orm/mysql'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TerminusModule } from '@nestjs/terminus'
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppConfig } from './config/app.config'
import { MysqlConfig } from './config/mysql.config'
import { PinoConfig } from './config/pino.config'

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

    TerminusModule,

    ConfigModule.inject(MysqlConfig, MikroOrmModule, (config) => ({
      ...config,
      entities: ['dist/**/*.entity.js'],
      driver: MySqlDriver,
    })),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
