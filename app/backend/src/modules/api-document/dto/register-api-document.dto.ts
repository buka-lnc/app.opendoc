import { TakeType } from '@miaooo/nestjs-take-type'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { ApiDocument } from '../entities/api-document.entity'

export class RegisterApiDocumentDTO extends TakeType(ApiDocument, ['type', 'code'], ['title', 'cronSyncUrl', 'order']) {
  @IsString()
  folderMpath: string

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
