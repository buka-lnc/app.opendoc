import { TakeType } from '@miaooo/nestjs-take-type'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { Document } from '../entities/document.entity'

export class RegisterDocumentDto extends TakeType(Document, ['type', 'code'], ['title', 'cronSyncUrl']) {
  @IsString()
  folderMpath: string

  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      }
    }
  })
  file: Buffer
}
