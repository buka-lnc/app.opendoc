import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { AppConfig } from './config/app.config.js'
import { swaggerEnhance } from './core/swagger.enhance'
import { AppService } from './app.service'
import { FormDataEnhance } from './core/form-data.enhance'
import { MikroORM } from '@mikro-orm/core'


async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })
  const logger = app.get(Logger)
  app.useLogger(logger)

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)


  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const appConfig = app.get(AppConfig)
  app.enableShutdownHooks()

  FormDataEnhance(app)

  if (appConfig.migration) {
    const orm = app.get(MikroORM)
    const migrator = orm.getMigrator()
    await migrator.up()
  }

  const openapiDocument = swaggerEnhance(app)
  await app.init()
  const appService = app.get(AppService)
  await appService.registerOpendoc(openapiDocument)

  await app.listen(appConfig.port)
  logger.log(`application listen on ${appConfig.host}:${appConfig.port}`)
}

void bootstrap()
