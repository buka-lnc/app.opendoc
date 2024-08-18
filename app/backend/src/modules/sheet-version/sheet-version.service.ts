import * as R from 'ramda'
import * as semver from 'semver'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SheetVersion } from './entities/sheet-version.entity'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { QuerySheetVersionsDTO } from './dto/query-sheet-versions.dto'
import { QuerySheetVersionsResponseDTO } from './dto/query-sheet-versions-response.dto'
import { ParsedVersionDTO } from './dto/parsed-version.dto'
import { SheetVersionRepository } from './repository/sheet-version.repository'


@Injectable()
export class SheetVersionService {
  constructor(
    @InjectPinoLogger(SheetVersion.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly sheetVersionRepo: SheetVersionRepository,
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

  parse(version: string | SheetVersion): ParsedVersionDTO {
    if (version instanceof SheetVersion) {
      return {
        major: version.major,
        minor: version.minor,
        patch: version.patch,
        tag: version.tag,
        prerelease: version.prerelease,
      }
    }

    if (typeof version === 'string') {
      const parsed = semver.parse(version)
      if (!parsed) {
        throw new BadRequestException('invalid version')
      }

      const [tag, prerelease] = parsed.prerelease.length === 2 ? [String(parsed.prerelease[0]), Number(parsed.prerelease[1])] : ['', 0]

      return {
        major: parsed.major,
        minor: parsed.minor,
        patch: parsed.patch,
        tag,
        prerelease,
      }
    }

    throw new BadRequestException('version cannot be parsed')
  }
}
