import { EnsureRequestContext, EntityManager, MikroORM, wrap } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import * as fs from 'fs-extra'
import { request } from 'keq'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import * as path from 'path'
import { AppConfig } from '~/config/app.config'
import { FolderService } from '../folder/folder.service'
import { QueryApiDocumentsDTO } from './dto/query-api-documents.dto'
import { RegisterApiDocumentDTO } from './dto/register-api-document.dto'
import { ApiDocument } from './entities/api-document.entity'


@Injectable()
export class ApiDocumentService {
  constructor(
    @InjectPinoLogger(ApiDocumentService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,
    private readonly folderService: FolderService,
  ) {}

  @EnsureRequestContext()
  async register(dto: RegisterApiDocumentDTO): Promise<ApiDocument> {
    const folder = await this.folderService.ensurePath(dto.folderMpath)

    let document: ApiDocument

    document = await this.em.findOne(ApiDocument, {
      type: dto.type,
      code: dto.code,
      folder,
    })

    if (!document) {
      document = new ApiDocument()
      document.type = dto.type
      document.code = dto.code
      document.title = dto.code
      document.folder = wrap(folder).toReference()
    }

    if (dto.cronSyncUrl) document.cronSyncUrl = dto.cronSyncUrl
    if (dto.title) document.title = dto.title
    if (dto.order) document.order = dto.order
    this.em.persist(document)

    if (dto.file) await this.persistFile(document, dto.file)
    await this.em.flush()
    return document
  }


  private async getFilepath(document: ApiDocument): Promise<string> {
    const folder = await document.folder.load()
    return path.join(path.resolve(this.appConfig.storage), folder.mpath, document.code)
  }

  private async persistFile(document: ApiDocument, buf: Buffer): Promise<void> {
    const revisionHash = (await import('rev-hash')).default
    const hash = revisionHash(buf)

    if (document.hash === hash) {
      this.logger.info('document hash is same, skip')
      return
    }

    this.logger.info('document hash is different, persisting')

    const filepath = await this.getFilepath(document)
    const dir = path.dirname(filepath)

    await fs.ensureDir(dir)
    await fs.writeFile(filepath, buf)

    document.hash = hash
    // TODO: bump document.version
    this.em.persist(document)
  }

  @Cron('0 */10 * * * *')
  @EnsureRequestContext()
  async syncDocuments(): Promise<void> {
    const documents = await this.em.find(
      ApiDocument,
      {
        cronSyncUrl: { $ne: null },
      },
      {
        limit: 10,
        orderBy: { updateAt: 'ASC' },
      }
    )

    for (const document of documents) {
      await this.syncDocument(document)
      const res = await request
        .get(document.cronSyncUrl)
        .option('resolveWithFullResponse')

      const buf = Buffer.from(await res.arrayBuffer())
      await this.persistFile(document, buf)
      await this.em.flush()
    }
  }

  async syncDocument(document: ApiDocument): Promise<void> {
    const res = await request
      .get(document.cronSyncUrl)
      .option('resolveWithFullResponse')

    const buf = Buffer.from(await res.arrayBuffer())
    await this.persistFile(document, buf)
    await this.em.flush()
  }

  async queryDocumentById(documentId: string): Promise<ApiDocument> {
    return await this.em.findOneOrFail(ApiDocument, documentId)
  }

  async queryDocumentByCode(folderId: string, code: string): Promise<ApiDocument> {
    const folder = this.em.getReference('Folder', folderId)
    return await this.em.findOneOrFail(ApiDocument, { folder, code })
  }

  async queryDocuments(dto: QueryApiDocumentsDTO): Promise<ApiDocument[]> {
    const folder = this.em.getReference('Folder', dto.folderId)
    return await this.em.find(
      ApiDocument,
      { folder },
      {
        orderBy: {
          order: 'ASC',
        },
      }
    )
  }

  async queryDocumentFileById(documentId: string): Promise<fs.ReadStream> {
    const document = await this.em.findOneOrFail(ApiDocument, documentId)
    const filepath = await this.getFilepath(document)
    return fs.createReadStream(filepath)
  }
}
