import * as fs from 'fs-extra'
import { glob } from 'glob'
import {  temporaryDirectory } from 'tempy'
import * as compressing from 'compressing'


export async function parseGlob(pattern: string): Promise<Buffer> {
  const files = await glob(pattern)
  const dir = temporaryDirectory()

  await Promise.all(files.map(file => fs.copy(file, dir)))


  const tgzStream = new compressing.tgz.Stream()
  tgzStream.addEntry(dir, { ignoreBase: true })

  // @ts-ignore
  const { getStreamAsBuffer } = (await import('get-stream'))
  return await getStreamAsBuffer(tgzStream)
}
