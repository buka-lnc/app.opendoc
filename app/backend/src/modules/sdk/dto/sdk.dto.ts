import { OmitType } from '@nestjs/swagger'
import { Sdk } from '../entities/sdk.entity'
import { ParsedVersionDTO } from '~/modules/sheet-version/dto/parsed-version.dto'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'


export class SdkDTO extends OmitType(Sdk, ['plugin', 'sheet', 'version']) {
  @ValidateNested()
  @Type(() => ParsedVersionDTO)
  version!: ParsedVersionDTO
}
