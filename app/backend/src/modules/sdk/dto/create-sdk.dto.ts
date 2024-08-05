import { TakeType } from '@miaooo/nestjs-take-type'
import { Sdk } from '../entities/sdk.entity'
import { EntityReferenceDTO } from '~/dto/entity-reference.dto'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ParsedVersionDTO } from '~/modules/sheet-version/dto/parsed-version.dto'

export class CreateSdkDTO extends TakeType(
  Sdk,
  ['name'],
  []
) {
  @ValidateNested()
  @Type(() => EntityReferenceDTO)
  sheet!: EntityReferenceDTO

  @ValidateNested()
  @Type(() => ParsedVersionDTO)
  version!: ParsedVersionDTO

  @ValidateNested()
  @Type(() => EntityReferenceDTO)
  compiler!: EntityReferenceDTO
}
