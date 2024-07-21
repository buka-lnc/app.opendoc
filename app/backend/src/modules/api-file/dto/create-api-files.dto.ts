import { ApiProperty, PickType } from '@nestjs/swagger'
import { ValidateNested } from 'class-validator'
import { FileRawDTO } from './file-raw.dto'
import { Type } from 'class-transformer'
import { EntityReferenceDTO } from '~/dto/entity-reference.dto'
import { SheetVersion } from '~/modules/sheet-version/entities/sheet-version.entity'


export class CreateApiFilesDTO {
  @Type(() => EntityReferenceDTO)
  @ValidateNested()
  sheet!: EntityReferenceDTO

  @ApiProperty({
    type: () => PickType(SheetVersion, ['tag']),
  })
  @Type(() => PickType(SheetVersion, ['tag']))
  @ValidateNested()
  version?: {
    tag: string
  }

  @Type(() => FileRawDTO)
  @ValidateNested({ each: true })
  files!: FileRawDTO[]
}
