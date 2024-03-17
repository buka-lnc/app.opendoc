import { BadRequestException, Controller, Get, Param, StreamableFile } from '@nestjs/common'
import { RegistryService } from './registry.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import { PackageMetadataDTO } from './dto/package-metadata.dto'


@ApiTags('Register')
@Controller('registry')
export class RegistryController {
  constructor(
    private readonly registerService: RegistryService,
  ) {}

  @ApiOperation({
    description: '查询包的元数据',
  })
  @Get('/:packageScope?/:packageName')
  async getPackageMetadata(
    @Param('packageScope') packageScope: string | undefined,
    @Param('packageName') packageName: string,
  ): Promise<PackageMetadataDTO> {
    if (packageScope && !packageScope.startsWith('@')) {
      throw new BadRequestException('Invalid package scope')
    }


    if (!packageScope && packageName.includes('/')) {
      const [pScope, pName] = packageName.split('/')
      return this.registerService.getPackageMetadata(pScope?.slice(1), pName)
    }

    return this.registerService.getPackageMetadata(packageScope?.slice(1), packageName)
  }

  @ApiOperation({ description: '下载包' })
  @ApiException(() => BadRequestException)
  @Get('/:packageScope?/:packageName/-/:packageTag.tgz')
  async downloadPackage(
    @Param('packageScope') packageScope: string | undefined,
    @Param('packageName') packageName: string,
    @Param('packageTag') packageTag: string,
  ): Promise<StreamableFile> {
    if (packageScope && !packageScope.startsWith('@')) {
      throw new BadRequestException('Invalid package scope')
    }

    if (!packageTag.startsWith(packageName)) {
      throw new BadRequestException('Invalid package name')
    }

    const packageVersion = packageTag.slice(packageName.length + 1)

    const stream = await this.registerService.downloadPackage(packageScope?.slice(1), packageName, packageVersion)
    return new StreamableFile(stream)
  }
}
