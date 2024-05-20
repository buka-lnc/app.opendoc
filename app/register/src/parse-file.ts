import * as compressing from 'compressing'
import * as fs from 'fs-extra'
import { temporaryFile } from 'tempy'

export async function parseFile(file: string | object | Buffer): Promise<Buffer> {
  const tempFile = temporaryFile({ extension: 'tgz' })

  let buf: Buffer
  if (typeof file === 'string') {
    buf = Buffer.from(file)
  } else if (file instanceof Buffer) {
    buf= file
  } else if (typeof file === 'object') {
    buf = Buffer.from(JSON.stringify(file), 'utf-8')
  } else {
    throw new TypeError('file must be a string, a Buffer or an object')
  }

  await compressing.tgz.compressFile(buf, tempFile, { relativePath: 'openapi.json' })
  return fs.readFile(tempFile)
}
