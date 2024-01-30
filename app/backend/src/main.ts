import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { AppConfig } from './config/app.config.js'
import { swaggerEnhance } from './core/swagger.enhance'


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const logger = app.get(Logger)
  app.useLogger(logger)

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)

  swaggerEnhance(app)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  const appConfig = app.get(AppConfig)

  await app.listen(appConfig.port)
  logger.log(`application listen on ${appConfig.host}:${appConfig.port}`)
}

void bootstrap()
