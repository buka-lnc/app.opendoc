import * as R from 'ramda'
import { Injectable } from '@nestjs/common'
import { SheetVersion } from './entity/sheet-version.entity'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/mysql'
import { QuerySheetVersionsDTO } from './dto/query-sheet-versions.dto'
import { QuerySheetVersionsResponseDTO } from './dto/query-sheet-versions-response.dto'


@Injectable()
export class SheetVersionService {
  constructor(
    @InjectPinoLogger(SheetVersion.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    @InjectRepository(SheetVersion)
    private readonly sheetVersionRepo: EntityRepository<SheetVersion>,
  ) {}

  async querySheetVersions(dto: QuerySheetVersionsDTO): Promise<QuerySheetVersionsResponseDTO> {
    const qb = this.sheetVersionRepo.createQueryBuilder('version')

    if (!R.isNil(dto.offset)) {
      void qb
        .limit(dto.limit || 10)
        .offset(dto.offset)
    }

    if (dto.sheetId) {
      void qb.andWhere({ sheet: { id: dto.sheetId } })
    }

    const [results, total] = await qb.getResultAndCount()

    return {
      results,
      pagination: {
        total,
        limit: dto.limit || 10,
        offset: dto.offset || -1,
      },
    }
  }

  async querySheetVersion(sheetVersionId: string): Promise<SheetVersion> {
    return this.sheetVersionRepo.findOneOrFail(sheetVersionId)
  }
}
