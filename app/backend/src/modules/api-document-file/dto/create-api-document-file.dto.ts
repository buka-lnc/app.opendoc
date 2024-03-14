import { TakeType } from '@miaooo/nestjs-take-type'
import { ApiDocumentFile } from '../entities/api-document-file.entity'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString } from 'class-validator'

export class CreateApiDocumentFileDTO extends TakeType(
  ApiDocumentFile,
  ['tag'],
  [],
) {
  @IsNumberString()
  apiDocumentId!: string

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
  file!: Buffer
}
