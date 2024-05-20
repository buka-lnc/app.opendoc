import { Controller, Get, Param, Query } from '@nestjs/common'
import { SdkService } from './sdk.service'
import { ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Sdk } from './entity/sdk.entity'
import { QuerySdksDTO } from './dto/query-sdks.dto'
import { ResponseOfQuerySdksDTO } from './dto/response-of-query-sdks.dto'


@ApiTags('SDK')
@Controller('sdk')
@ApiInternalServerErrorResponse({ description: '系统异常' })
export class SdkController {
  constructor(
    private readonly sdkService: SdkService,
  ) {}

  @Get()
  async querySdks(
    @Query() dto: QuerySdksDTO
  ): Promise<ResponseOfQuerySdksDTO> {
    return this.sdkService.querySdks(dto)
  }


  @Get(':sdkId(\\d+)')
  @ApiOperation({ summary: '查询 SDK 详情' })
  async querySdk(
    @Param('sdkId') sdkId: string,
  ): Promise<Sdk> {
    return await this.sdkService.querySdk(sdkId)
  }
}
