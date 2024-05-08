import { request } from './request'
import * as path from 'path'
import * as fs from 'fs-extra'
import { RegisterOpendocOptions } from './interface/register-opendoc-options'
import * as compressing from 'compressing'
import { temporaryFile } from 'tempy'


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
    const { code, type, title, order } = apiDocument

    const tempFile = temporaryFile({ extension: 'tgz' })

    if ('file' in apiDocument) {
      if (typeof apiDocument.file === 'string') {
        const buf = Buffer.from(apiDocument.file)
        await compressing.tgz.compressFile(buf, tempFile)
      } else if (apiDocument.file instanceof Buffer) {
        await compressing.tgz.compressFile(apiDocument.file, tempFile)
      } else if (typeof apiDocument.file === 'object') {
        const buf = Buffer.from(JSON.stringify(apiDocument.file), 'utf-8')
        await compressing.tgz.compressFile(buf, tempFile)
      } else {
        throw new TypeError('file must be a string, a Buffer or an object')
      }
    } else if ('filepath' in apiDocument) {
      const filepath = path.isAbsolute(apiDocument.filepath) ? apiDocument.filepath : path.join(process.cwd(), apiDocument.filepath)
      const stats = await fs.lstat(filepath)
      if (stats.isDirectory()) {
        await compressing.tgz.compressDir(filepath, tempFile)
      } else if (stats.isFile()) {
        await compressing.tgz.compressFile(filepath, tempFile)
      } else {
        throw new TypeError(`file(${filepath}) is not a directory or a file`)
      }
    }

    const apiDocumentFile = await fs.readFile(tempFile)

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
