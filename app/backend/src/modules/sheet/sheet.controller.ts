import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SheetService } from './sheet.service'
import { RegisterSheetDTO } from './dto/register-sheet.dto'
import { CreateSheetDTO } from './dto/create-sheet.dto'
import { Sheet } from './entity/sheet.entity'
import { QuerySheetsDTO } from './dto/query-sheets.dto'
import { ResponseOfQuerySheetsDTO } from './dto/response-of-query-sheets.dto'
import { SheetSynchronizeService } from './sheet-synchronize.service'
import { ApiFile } from '../api-file/entities/api-file.entity'
import { UpdateSheetDTO } from './dto/update-sheet.dto'
import { EntityManager } from '@mikro-orm/mysql'
import { MikroORM } from '@mikro-orm/core'


@ApiTags('API Sheet')
@Controller('sheet')
@ApiInternalServerErrorResponse({ description: '系统异常' })
export class SheetController {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,

    private readonly sheetService: SheetService,
    private readonly sheetSynchronizeService: SheetSynchronizeService,
  ) {}

  @Put('register')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '注册 API 文档',
    description: '若 applicationCode 指定的应用不存在，则会新建一个应用；否则，更新应用。',
  })
  @UseInterceptors(FileInterceptor('apiFileRaw'))
  async registerSheet(
    @Body() dto: RegisterSheetDTO,
    @UploadedFile() apiFileRaw?: Express.Multer.File,
  ): Promise<void> {
    await this.sheetService.register({
      ...dto,
      apiFileRaw: apiFileRaw?.buffer,
    })
  }

  @Put(':sheetId')
  @ApiOperation({ summary: '更新 API 文档' })
  async updateSheet(
    @Param('sheetId') sheetId: string,
    @Body() dto: UpdateSheetDTO,
  ): Promise<Sheet> {
    return this.sheetService.update(sheetId, dto)
  }

  @Post()
  @ApiOperation({ summary: '创建 API 文档' })
  async createSheet(
    @Body() dto: CreateSheetDTO,
  ): Promise<Sheet> {
    return this.sheetService.create(dto)
  }

  @Delete(':sheetId')
  @ApiOperation({ summary: '删除 API 文档' })
  async deleteSheet(
    @Param('sheetId') sheetId: string,
  ): Promise<void> {
    await this.sheetService.remove(sheetId)
  }

  @Post(':sheetId/sync')
  @ApiOperation({ summary: '同步指定的 API 文档' })
  async syncApiDocument(
    @Param('sheetId') sheetId: string,
  ): Promise<void> {
    await this.sheetService.sync(sheetId)
  }

  @Post('sync')
  @ApiOperation({ summary: '同步所有 API 文档', description: '每隔 10 分钟自动同步一次' })
  async syncApiDocuments(): Promise<void> {
    await this.sheetSynchronizeService.synchronizeAll()
  }

  @Get()
  @ApiOperation({ summary: '查询 API 文档列表' })
  async querySheets(
    @Query() dto: QuerySheetsDTO,
  ): Promise<ResponseOfQuerySheetsDTO> {
    return this.sheetService.querySheets(dto)
  }

  @Get(':sheetId')
  @ApiOperation({ summary: '查询 API 文档详情' })
  async querySheetById(
    @Param('sheetId') sheetId: string,
  ): Promise<Sheet> {
    return this.sheetService.querySheetById(sheetId)
  }

  @Get(':sheetId/version/:version/path/:path*')
  async queryApiFileBySheetId(
    @Param('sheetId') sheetId: string,
    @Param('version') version: string,
    @Param('path') path: string,
  ): Promise<ApiFile> {
    return this.sheetService.queryApiFile(sheetId, version, path)
  }
}
