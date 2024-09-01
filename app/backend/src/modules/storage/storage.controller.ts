import { Controller, Delete } from '@nestjs/common'
import { CacheService } from './cache.service'
import { ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger'


@ApiTags('Storage', '存储')
@Controller('storage')
@ApiInternalServerErrorResponse({ description: '系统异常' })
export class StorageController {
  constructor(
    private readonly cacheService: CacheService,
  ) {}

  @ApiOperation({ summary: '清空缓存' })
  @Delete('cache')
  async clearStorageCache(): Promise<void> {
    await this.cacheService.clear()
  }
}
