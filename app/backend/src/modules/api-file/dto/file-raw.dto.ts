import { TakeType } from '@miaooo/nestjs-take-type'
import { ApiProperty } from '@nestjs/swagger'
import { ApiFile } from '../entities/api-file.entity'

export class FileRawDTO extends TakeType(
  ApiFile,
  ['path'],
  [],
) {
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
