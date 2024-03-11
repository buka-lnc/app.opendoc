import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { RegistryService } from './registry.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'


@ApiTags('Register')
@Controller('registry')
export class RegistryController {
  constructor(
    private readonly registerService: RegistryService,
  ) {}

  @ApiOperation({
    description: '查询包的元数据',
  })
  @Get('/:packageName')
  getPackageMetadata() {
    return this.registerService.getPackageMetadata()
  }

  @ApiOperation({ description: '下载包' })
  @ApiException(() => BadRequestException)
  @Get('/:scope?/:packageName/-/:packageTag.tgz')
  downloadPackage(
    @Param('scope') scope: string | undefined,
    @Param('packageName') packageName: string,
    @Param('packageTag') packageTag: string,
  ) {
    if (!packageTag.startsWith(packageName)) {
      throw new BadRequestException('Invalid package name')
    }

    return this.registerService.downloadPackage()
  }
}
