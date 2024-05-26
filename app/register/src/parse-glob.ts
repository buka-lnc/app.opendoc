import * as fs from 'fs-extra'
import { glob } from 'glob'
import * as compressing from 'compressing'
import * as getStream from 'get-stream'
import * as tempy from 'tempy'


export async function parseGlob(pattern: string): Promise<Buffer> {
  const files = await glob(pattern)
  const dir = tempy.directory()

  await Promise.all(files.map(file => fs.copy(file, dir)))


  const tgzStream = new compressing.tgz.Stream()
  tgzStream.addEntry(dir, { ignoreBase: true })

  return await getStream.buffer(tgzStream)
}
