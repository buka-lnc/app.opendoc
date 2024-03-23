import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, OpenAPIObject, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import { AppConfig } from '~/config/app.config'
import * as packageJson from '~~/package.json'


export function swaggerEnhance(app: INestApplication): OpenAPIObject {
  const appConfig = app.get(AppConfig)

  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addServer('/', '本地')
    .addServer(new URL(appConfig.registry).origin, 'Registry')
    .build()

  const docOptions: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey,
  }

  const document = SwaggerModule.createDocument(app, config, docOptions)
  SwaggerModule.setup('/swagger/ui', app, document)
  const httpAdapter = app.getHttpAdapter()
  httpAdapter.get('/swagger', (_req, res) => {
    res.json(document)
  })

  return document
}
