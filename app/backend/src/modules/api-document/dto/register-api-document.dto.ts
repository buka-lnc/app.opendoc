import { IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CreateApiDocumentDTO } from './create-api-document.dto'

export class RegisterApiDocumentDTO extends CreateApiDocumentDTO {
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
  @IsOptional()
  apiDocumentFile?: Buffer
}
