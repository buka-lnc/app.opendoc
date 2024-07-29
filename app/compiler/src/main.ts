import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { AppConfig } from './config/app.config.js'
import { swaggerEnhance } from './core/swagger.enhance'
import { OpendocWsAdapter } from './adapter/opendoc-ws.adapter'


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })
  const logger = app.get(Logger)
  app.useLogger(logger)

  app.useWebSocketAdapter(new OpendocWsAdapter(app))

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const appConfig = app.get(AppConfig)
  app.enableShutdownHooks()

  swaggerEnhance(app)

  await app.listen(appConfig.port)
  logger.log(`application listen on ${appConfig.host}:${appConfig.port}`)
}

void bootstrap()
