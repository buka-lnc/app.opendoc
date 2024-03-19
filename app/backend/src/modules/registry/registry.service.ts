import * as fs from 'fs-extra'
import * as R from 'ramda'
import * as semver from 'semver'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Sdk } from '~/modules/sdk/entity/sdk.entity'
import { PackageMetadataDTO } from './dto/package-metadata.dto'
import { PackageMetadataVersionDistDTO } from './dto/package-metadata-version-dist.dto'
import { PackageMetadataVersionDTO } from './dto/package-metadata-version.dto'
import { AppConfig } from '~/config/app.config'
import { SdkService } from '~/modules/sdk/sdk.service'


@Injectable()
export class RegistryService {
  constructor(
    @InjectPinoLogger(RegistryService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly sdkService: SdkService,

    @InjectRepository(Sdk)
    private readonly sdkRepo: EntityRepository<Sdk>,
  ) {}

  async getPackageMetadata(packageScope: string | undefined, packageName: string): Promise<PackageMetadataDTO> {
    const npmPackages = await this.sdkRepo.find({
      scope: packageScope,
      name: packageName,
      isPublished: true,
    })

    if (!npmPackages.length) {
      throw new NotFoundException()
    }

    const taggedPackages = R.groupWith((p1, p2) => p1.tag === p2.tag, npmPackages)
      .map((npmPackages) => {
        const npmPackage = npmPackages.reduce(
          (maxVersion, npmPackages) => {
            if (semver.gt(npmPackages.version, maxVersion.version)) {
              return npmPackages
            }
            return maxVersion
          },
          npmPackages[0]
        )

        return npmPackage
      })

    const distTag = taggedPackages.reduce(
      (tagMap, npmPackage) => R.assoc(npmPackage.tag || 'latest', npmPackage.version, tagMap),
      <Record<string, string>>{}
    )

    const time = npmPackages.reduce(
      (timeMap, npmPackage) => R.assoc(npmPackage.version, npmPackage.updatedAt.toISOString(), timeMap),
        <Record<string, string>>{}
    )


    const versions = npmPackages.reduce(
      (versionMap, npmPackage) => R.assoc(npmPackage.version, {
        name: npmPackage.fullName,
        version: npmPackage.version,
        dist: <PackageMetadataVersionDistDTO>{
          tarball: `${this.appConfig.registry}${npmPackage.tarball}`,
          integrity: npmPackage.integrity,
        },
      }, versionMap),
      <Record<string, PackageMetadataVersionDTO>>{}
    )


    return {
      name: `${packageScope ? `@${packageScope}/` : ''}${packageName}`,
      'dist-tags': distTag,
      time,
      versions,
    }
  }

  async downloadPackage(packageScope: string | undefined, packageName: string, version: string): Promise<fs.ReadStream> {
    const npmPackage = await this.sdkRepo.findOneOrFail({
      scope: packageScope,
      name: packageName,
      version: version,
      isPublished: true,
    })

    const tarballFilepath = this.sdkService.getTarballFilepath(npmPackage)
    return fs.createReadStream(tarballFilepath)
  }
}
