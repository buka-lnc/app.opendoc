import { ApiProperty, PickType } from '@nestjs/swagger'
import { CreateApiFilesDTO } from './create-api-files.dto'

export class CreateApiFileByTgzDTO extends PickType(CreateApiFilesDTO, ['sheet', 'version']) {
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
  raw!: Buffer
}
