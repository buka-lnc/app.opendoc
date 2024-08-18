import { ValidateNested } from 'class-validator'
import { ForeignFile } from './foreign-file.dto'
import { Transform, Type } from 'class-transformer'
import { EntityReferenceDTO } from '~/dto/entity-reference.dto'
import { Sheet } from '~/modules/sheet/entities/sheet.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Reference } from '@mikro-orm/core'
import { SheetVersion } from '~/modules/sheet-version/entities/sheet-version.entity'


export class CreateApiFilesDTO {
  @ApiProperty({
    type: () => EntityReferenceDTO,
  })
  @Transform(({ value }) => Reference.createFromPK(Sheet, value.id as string))
  sheet!: Sheet

  // @Type(() => ParsedVersionDTO)
  // @ValidateNested()
  version!: SheetVersion

  @Type(() => ForeignFile)
  @ValidateNested({ each: true })
  files!: ForeignFile[]
}
