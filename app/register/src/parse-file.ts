import * as compressing from 'compressing'
import * as getStream from 'get-stream'

export async function parseFile(filename: string, file: string | object | Buffer): Promise<Buffer> {
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

  const tgzStream = new compressing.tgz.Stream()
  tgzStream.addEntry(buf, { relativePath: filename })

  return await getStream.buffer(tgzStream)
}
