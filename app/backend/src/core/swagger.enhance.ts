import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import * as packageJson from '~~/package.json'


export function swaggerEnhance(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    // .addServer(`http://${appConfig.host}:${appConfig.port}`, '本地')
    .addServer('/', '本地')
    .addServer('http://backend-svc.aladdin', '内网')
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
}
