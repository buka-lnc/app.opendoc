import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'
import { API_DOCUMENT_TYPE } from '../constants/api-document-type.enum'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterApiDocumentDTO {
  /**
   * 应用编码
   * 将文档注册到哪个应用下
   */
  @IsString()
  @MaxLength(63)
  applicationCode: string

  /**
   * 易于阅读的文档编码(Folder下唯一)
   */
  @IsString()
  @MaxLength(63)
  apiDocumentCode: string

  /**
   * 文档类型
   * @example "openapi"
   */
  @IsEnum(API_DOCUMENT_TYPE)
  apiDocumentType?: API_DOCUMENT_TYPE

  /**
   * 文档名称
   */
  @IsString()
  @MaxLength(127)
  apiDocumentTitle?: string

  /**
   * 文档文件的定时同步地址
   */
  @IsString()
  @MaxLength(255)
  apiDocumentCronSyncUrl?: string

  /**
   * 文档排序
   * @example 1
   */
  @IsNumber()
  apiDocumentOrder?: number

  /**
   * 文档标签
   * @example "latest"
   */
  @IsString()
  @IsOptional()
  @MaxLength(24)
  apiDocumentFileTag?: string

  /**
   * 文档文件
   */
  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  apiDocumentFile?: Buffer
}
