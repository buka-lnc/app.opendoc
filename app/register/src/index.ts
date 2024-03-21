import { request } from 'keq'
import * as path from 'path'
import { RegisterOpendocOptions } from './interface/register-opendoc-options'


export async function registerToOpendoc(options: RegisterOpendocOptions) {
  const { server, file } = options

  await request
    .put(path.join(server, '/api/application'))
    .send({
      code: 'opendoc',
      title: 'OpenDoc',
    })

  let apiDocumentFile: Buffer

  if (typeof file === 'string') {
    apiDocumentFile = Buffer.from(file)
  } else if (file instanceof Buffer) {
    apiDocumentFile = file
  } else if (typeof file === 'object') {
    apiDocumentFile = Buffer.from(JSON.stringify(file), 'utf-8')
  } else {
    throw new TypeError('file type not supported')
  }

  await request
    .put(path.join(server, '/api/api-document'))
    .field('applicationCode', 'opendoc')
    .field('apiDocumentType', 'OPEN_API')
    .field('apiDocumentCode', 'openapi')
    .field('apiDocumentTitle', 'OpenAPI')
    .field('apiDocumentOrder', '2')
    .attach('apiDocumentFile', apiDocumentFile)
}
