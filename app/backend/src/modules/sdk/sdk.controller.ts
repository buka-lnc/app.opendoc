import { Controller, Get, Param } from '@nestjs/common'
import { SdkService } from './sdk.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Sdk } from './entity/sdk.entity'


@ApiTags('SDK')
@Controller('sdk')
export class SdkController {
  constructor(
    private readonly sdkService: SdkService,
  ) {}

  @Get(':sdkId')
  @ApiOperation({ summary: '查询 SDK 详情' })
  async querySdkById(
    @Param('sdkId') sdkId: string,
  ): Promise<Sdk> {
    return await this.sdkService.querySdkById(sdkId)
  }
}
