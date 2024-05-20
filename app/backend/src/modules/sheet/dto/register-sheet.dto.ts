import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SheetType } from '../constants/sheet-type.enum'
import { ToNumber } from '@buka/class-transformer-extra'
import { SheetMode } from '../constants/sheet-mode.enum'


export class RegisterSheetDTO {
  /**
   * 应用编码
   * 将文档注册到哪个应用下
   */
  @IsString()
  @MaxLength(63)
  applicationCode!: string

  /**
   * 易于阅读的文档编码(Folder下唯一)
   */
  @IsString()
  @MaxLength(63)
  sheetCode!: string

  /**
   * 文档类型
   * @example "openapi"
   */
  @IsEnum(SheetType)
  sheetType!: SheetType

  /**
   * 文档名称
   */
  @IsString()
  @MaxLength(127)
  @IsOptional()
  sheetTitle?: string

  /**
   * 文档排序
   * @example 1
   */
  @ToNumber()
  @IsInt()
  @IsOptional()
  sheetOrder?: number

  /**
   * 文档同步模式
   *
   * @default ApiDocumentMode.PUSH
   */
  @IsEnum(SheetMode)
  @IsOptional()
  sheetMode?: SheetMode = SheetMode.PUSH

  @IsOptional()
  @IsString()
  @MaxLength(255)
  sheetPullCrontabUrl?: string

  /**
   * 文档文件
   * tgz 压缩文件
   */
  @ApiProperty({
    type: 'file',
    description: 'tgz 压缩文件',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  @IsOptional()
  apiFileRaw?: Buffer

  /**
   * 文档标签
   * @example "latest"
   */
  @IsString()
  @IsOptional()
  @MaxLength(24)
  apiFileVersionTag?: string
}
