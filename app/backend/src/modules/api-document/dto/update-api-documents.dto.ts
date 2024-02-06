import { TakeType } from '@miaooo/nestjs-take-type'
import { ApiProperty } from '@nestjs/swagger'
import { ApiDocument } from '../entities/api-document.entity'


export class UpdateApiDocumentDTO extends TakeType(ApiDocument, ['type', 'code'], ['title', 'cronSyncUrl', 'order']) {
  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  file?: Buffer
}
