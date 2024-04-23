import { request } from './request'
import * as path from 'path'
import { RegisterOpendocOptions } from './interface/register-opendoc-options'


export async function registerToOpendoc(options: RegisterOpendocOptions) {
  const { server, application, apiDocuments } = options

  try {
    await request
      .put(path.join(server, '/api/application'))
      .send({
        code: application.code,
        title: application.title || application.code,
      })
      .retry(3, 100)
  } catch (e) {
    throw new Error('register application failed')
  }

  const promises = apiDocuments.map(async (apiDocument) => {
    const { code, type, title, order, file } = apiDocument
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

    try {
      await request
        .put(path.join(server, '/api/api-document'))
        .field('applicationCode', application.code)
        .field('apiDocumentType', type)
        .field('apiDocumentCode', code)
        .field('apiDocumentTitle', title || code)
        .field('apiDocumentOrder', String(order || 1))
        .attach('apiDocumentFile', apiDocumentFile)
        .retry(3, 100)
    } catch (e) {
      throw new Error(`register api document failed`)
    }
  })

  await Promise.allSettled(promises)
}
