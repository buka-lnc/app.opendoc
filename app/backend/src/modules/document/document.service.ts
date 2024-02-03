import { EnsureRequestContext, EntityManager, MikroORM, wrap } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import * as fs from 'fs-extra'
import { request } from 'keq'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import * as path from 'path'
import { AppConfig } from '~/config/app.config'
import { FolderService } from '../folder/folder.service'
import { RegisterDocumentDTO } from './dto/register-document.dto'
import { Document } from './entities/document.entity'


@Injectable()
export class DocumentService {
  constructor(
    @InjectPinoLogger(DocumentService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,
    private readonly folderService: FolderService,
  ) {}

  @EnsureRequestContext()
  async register(dto: RegisterDocumentDTO): Promise<void> {
    const folder = await this.folderService.ensurePath(dto.folderMpath)

    let document: Document

    document = await this.em.findOne(Document, {
      type: dto.type,
      code: dto.code,
      folder,
    })

    if (!document) {
      document = new Document()
      document.type = dto.type
      document.code = dto.code
      document.folder = wrap(folder).toReference()
    }

    if (dto.cronSyncUrl) document.cronSyncUrl = dto.cronSyncUrl
    if (dto.title) document.title = dto.title
    this.em.persist(document)

    await this.persistFile(document, dto.file)
    await this.em.flush()
  }

  private async persistFile(doc: Document, buf: Buffer): Promise<void> {
    const revisionHash = (await import('rev-hash')).default
    const hash = revisionHash(buf)

    if (doc.hash === hash) {
      this.logger.info('document hash is same, skip')
      return
    }

    this.logger.info('document hash is different, persisting')

    const folder = await doc.folder.load()
    const dir = path.join(path.resolve(this.appConfig.storage), folder.mpath)
    const filepath = path.join(dir, doc.code)

    await fs.ensureDir(dir)
    await fs.writeFile(filepath, buf)

    doc.hash = hash
    // TODO: bump doc.version
    this.em.persist(doc)
  }

  @Cron('0 */10 * * * *')
  @EnsureRequestContext()
  async syncDocuments(): Promise<void> {
    const documents = await this.em.find(Document, {
      cronSyncUrl: { $ne: null },
    })

    for (const document of documents) {
      const res = await request
        .get(document.cronSyncUrl)
        .option('resolveWithFullResponse')

      const buf = Buffer.from(await res.arrayBuffer())
      await this.persistFile(document, buf)
      await this.em.flush()
    }
  }
}
