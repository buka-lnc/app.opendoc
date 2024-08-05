import { ApplicationDTO } from '~/modules/application/dto/application.dto'
import { SheetDTO } from '~/modules/sheet/dto/sheet.dto'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { Compiler } from '../entities/compiler.entity'
import { ParsedVersionDTO } from '~/modules/sheet-version/dto/parsed-version.dto'


export class SheetVersionBumpEventMessageDataDTO {
  @ValidateNested()
  @Type(() => ApplicationDTO)
  application!: ApplicationDTO

  @ValidateNested()
  @Type(() => SheetDTO)
  sheet!: SheetDTO

  @ValidateNested()
  @Type(() => ParsedVersionDTO)
  version!: ParsedVersionDTO

  @ValidateNested()
  @Type(() => Compiler)
  compiler!: Compiler
}
