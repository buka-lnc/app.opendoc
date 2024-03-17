import * as fs from 'fs-extra'
import * as R from 'ramda'
import * as semver from 'semver'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'
import { NpmPackage } from './entity/npm-package.entity'
import { BuildTask } from './entity/build-task.entity'
import { PackageMetadataDTO } from './dto/package-metadata.dto'
import { PackageMetadataVersionDistDTO } from './dto/package-metadata-version-dist.dto'
import { PackageMetadataVersionDTO } from './dto/package-metadata-version.dto'
import { AppConfig } from '~/config/app.config'
import { PublishPackageService } from './publish-package.service'


@Injectable()
export class RegistryService {
  constructor(
    @InjectPinoLogger(RegistryService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly publishPackageService: PublishPackageService,

    @InjectRepository(ApiDocumentFile)
    private readonly apiDocumentFileRepo: EntityRepository<ApiDocumentFile>,

    @InjectRepository(NpmPackage)
    private readonly npmPackageRepo: EntityRepository<NpmPackage>,

    @InjectRepository(BuildTask)
    private readonly buildTaskRepo: EntityRepository<BuildTask>,
  ) {}

  async getPackageMetadata(packageScope: string | undefined, packageName: string): Promise<PackageMetadataDTO> {
    const npmPackages = await this.npmPackageRepo.find({
      scope: packageScope,
      name: packageName,
      isPublished: true,
    })

    if (!npmPackages.length) {
      throw new NotFoundException()
    }

    const taggedNpmPackages = R.groupWith((p1, p2) => p1.tag === p2.tag, npmPackages)
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

    const distTag = taggedNpmPackages.reduce(
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
    const npmPackage = await this.npmPackageRepo.findOneOrFail({
      scope: packageScope,
      name: packageName,
      version: version,
      isPublished: true,
    })

    const tarballFilepath = this.publishPackageService.getTarballFilepath(npmPackage)
    return fs.createReadStream(tarballFilepath)
  }
}
