import { Controller, Get, Param, Query } from '@nestjs/common'
import { SheetVersionService } from './sheet-version.service'
import { QuerySheetVersionsResponseDTO } from './dto/query-sheet-versions-response.dto'
import { QuerySheetVersionsDTO } from './dto/query-sheet-versions.dto'
import { SheetVersion } from './entity/sheet-version.entity'


@Controller('sheet-version')
export class SheetVersionController {
  constructor(
    private readonly sheetVersionService: SheetVersionService,
  ) {}

  @Get()
  async querySheetVersions(
    @Query() dto: QuerySheetVersionsDTO,
  ): Promise<QuerySheetVersionsResponseDTO> {
    return await this.sheetVersionService.querySheetVersions(dto)
  }

  @Get(':sheetVersionId')
  async querySheetVersion(
    @Param('sheetVersionId') sheetVersionId: string,
  ): Promise<SheetVersion> {
    return this.sheetVersionService.querySheetVersion(sheetVersionId)
  }
}
