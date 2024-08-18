import { EntityRepository } from '@mikro-orm/mysql'
import { SheetVersion } from '../entities/sheet-version.entity'
import { BadRequestException } from '@nestjs/common'
import semver from 'semver'
import { Sheet } from '~/modules/sheet/entities/sheet.entity'

export class SheetVersionRepository extends EntityRepository<SheetVersion> {
  /**
   * 创建初始版本
   * 有 tag 则创建 0.0.1-tag.0 版本
   * 无 tag 则创建 0.0.1 版本
   */
  createInitialVersion(sheet: Sheet, tag?: string): SheetVersion {
    return this.create({
      major: 0,
      minor: 0,
      patch: 1,
      tag: tag || '',
      prerelease: 0,
      sheet,
    })
  }

  increase(version: SheetVersion, releaseType: 'major' | 'minor' | 'patch', tag?: string): SheetVersion {
    const versionStr = version.string

    const next = tag ? semver.inc(versionStr, 'prerelease', tag) : semver.inc(versionStr, releaseType)
    if (!next) {
      throw new BadRequestException('invalid version')
    }

    const nextVersion = this.parse(next)
    nextVersion.sheet = version.sheet
    return nextVersion
  }


  parse(v: string): SheetVersion {
    const parsed = semver.parse(v)
    if (!parsed) {
      throw new BadRequestException('invalid version')
    }

    const [tag, prerelease] = parsed.prerelease.length === 2 ? [String(parsed.prerelease[0]), Number(parsed.prerelease[1])] : ['', 0]

    const sheetVersion = new SheetVersion()
    sheetVersion.major = parsed.major
    sheetVersion.minor = parsed.minor
    sheetVersion.patch = parsed.patch
    sheetVersion.tag = tag
    sheetVersion.prerelease = prerelease

    return sheetVersion
  }
}
