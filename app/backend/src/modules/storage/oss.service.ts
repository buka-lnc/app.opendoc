import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { StandardStorageService } from "./interface/standard-storage-service";
import { Readable } from "stream";
import { StorageConfig } from "~/config/storage.config";
import { NotFoundException } from "@nestjs/common";
import { buffer } from "stream/consumers";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'


export class OssService implements StandardStorageService {
  private client: S3Client

  constructor(
    @InjectPinoLogger(OssService.name)
    private readonly logger: PinoLogger,

    private readonly storageConfig: StorageConfig,
  ){
    this.client = new S3Client({
      region: this.storageConfig.ossRegion,
      endpoint: this.storageConfig.ossEndpoint,
      credentials: {
        accessKeyId: this.storageConfig.ossAccessKeyId,
        secretAccessKey: this.storageConfig.ossAccessKeySecret,
      },
      apiVersion: '2006-03-01'
    })
  }

  async writeFile(filepath: string, content: Buffer): Promise<void> {
    this.logger.debug(`Writing file to OSS: ${filepath}`)
    const command = new PutObjectCommand({
      Key: filepath,
      Bucket: this.storageConfig.ossBucket,
      Body: content
    })

    await this.client.send(command)
  }

  async readFile(filepath: string): Promise<Buffer> {
    this.logger.debug(`Reading file from OSS: ${filepath}`)
    const reader = await this.createStream(filepath)
    const buf = await buffer(reader)
    return buf
  }

  async createStream(filepath: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Key: filepath,
      Bucket: this.storageConfig.ossBucket,
    })

    const response = await this.client.send(command)
    if (!response.Body) {
      throw new NotFoundException(`Cannot find file ${filepath} in OSS`)
    }

    const body = response.Body as Readable
    return body
  }

  async removeFile(filepath: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Key: filepath,
      Bucket: this.storageConfig.ossBucket,
    })

    await this.client.send(command)
  }
}
