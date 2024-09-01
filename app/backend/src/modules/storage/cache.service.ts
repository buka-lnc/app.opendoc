import * as path from 'path'
import * as fs from 'fs-extra'
import { Injectable } from '@nestjs/common'
import { StorageConfig } from '~/config/storage.config'
import { Readable } from 'stream'

@Injectable()
export class CacheService {
  readonly directory: string

  constructor(
    private readonly storageConfig: StorageConfig,
  ) {
    const directory = path.isAbsolute(this.storageConfig.directory) ? this.storageConfig.directory : path.resolve(this.storageConfig.directory)
    this.directory = path.join(directory, 'cache')
  }

  async exists(filepath: string): Promise<boolean> {
    const cacheFilepath = path.join(this.directory, filepath)
    return await fs.pathExists(cacheFilepath)
  }

  async add(filepath: string, content: Buffer | Readable): Promise<void> {
    const cacheFilepath = path.join(this.directory, filepath)
    await fs.ensureDir(path.dirname(cacheFilepath))

    const intoStream = (await import('into-stream')).default
    const stream = intoStream(content)

    await new Promise((resolve, reject) => {
      fs.createWriteStream(cacheFilepath).write(stream, (error) => {
        if (error) reject(error)
        else resolve(undefined)
      })
    })
  }

  async removeFile(filepath: string): Promise<void> {
    const cacheFilepath = path.join(this.directory, filepath)
    await fs.remove(cacheFilepath)
  }

  async readFile(filepath: string): Promise<Buffer> {
    const cacheFilepath = path.join(this.directory, filepath)
    return await fs.readFile(cacheFilepath)
  }

  async createStream(filepath: string): Promise<Readable> {
    const cacheFilepath = path.join(this.directory, filepath)
    const intoStream = (await import('into-stream')).default
    const stream = fs.createReadStream(cacheFilepath)
    return intoStream(stream)
  }

  async clear(): Promise<void> {
    await fs.emptyDir(this.directory)
  }
}
