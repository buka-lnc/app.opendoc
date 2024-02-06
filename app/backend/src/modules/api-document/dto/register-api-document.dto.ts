import { IsEnum, IsNumber, IsString, MaxLength } from 'class-validator'
import { API_DOCUMENT_TYPE } from '../constants/api-document-type.enum'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterApiDocumentDTO {
  @IsString()
  @MaxLength(63)
  applicationCode: string

  @IsString()
  @MaxLength(63)
  apiDocumentCode: string

  @IsEnum(API_DOCUMENT_TYPE)
  apiDocumentType?: API_DOCUMENT_TYPE

  @IsString()
  @MaxLength(127)
  apiDocumentTitle?: string

  @IsString()
  @MaxLength(255)
  apiDocumentCronSyncUrl?: string

  @IsNumber()
  apiDocumentOrder?: number

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
