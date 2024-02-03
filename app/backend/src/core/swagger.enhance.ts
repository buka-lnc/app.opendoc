import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import { DOCUMENT_TYPE } from '~/modules/document/constants/document-type.enum'
import { DocumentService } from '~/modules/document/document.service'
import * as packageJson from '~~/package.json'


export async function swaggerEnhance(app: INestApplication): Promise<void> {
  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
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

  const documentService = app.get(DocumentService)
  await documentService.register({
    type: DOCUMENT_TYPE.OPEN_API,
    code: 'openapi',
    folderMpath: 'opendoc',
    file: Buffer.from(JSON.stringify(document), 'utf-8')
  })
}
