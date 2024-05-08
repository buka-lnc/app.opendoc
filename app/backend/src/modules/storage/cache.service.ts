import * as path from 'path'
import { Injectable } from "@nestjs/common";
import { StorageConfig } from "~/config/storage.config";

@Injectable()
export class CacheService {
  readonly directory: string;

  constructor(
    private readonly storageConfig: StorageConfig,
  ) {
    const directory = path.isAbsolute(this.storageConfig.directory) ? this.storageConfig.directory : path.resolve(this.storageConfig.directory)
    this.directory = path.join(directory, 'cache')
  }
}
