import * as path from 'path'
import * as fs from 'fs-extra'


export async function parseFilepath(filepath: string): Promise<Buffer> {
  const fullpath = path.isAbsolute(filepath) ? filepath : path.join(process.cwd(), filepath)

  const stats = await fs.lstat(fullpath)


  if (stats.isFile()) {
    return fs.readFile(fullpath)
  }

  throw new TypeError(`file(${filepath}) is not a file`)
}

