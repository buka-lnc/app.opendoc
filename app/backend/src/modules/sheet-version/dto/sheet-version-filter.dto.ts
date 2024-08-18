import { Type } from 'class-transformer'
import { IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator'
import { EntityReferenceDTO } from '~/dto/entity-reference.dto'

export class SheetVersionFilterDTO {
  @IsOptional()
  @ValidateNested()
  @Type(() => EntityReferenceDTO)
  sheet?: EntityReferenceDTO

  @MaxLength(24)
  @IsOptional()
  @IsString()
  tag?: string
}
