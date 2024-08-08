import { ApplicationDTO } from '~/modules/application/dto/application.dto'
import { SheetDTO } from '~/modules/sheet/dto/sheet.dto'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ParsedVersionDTO } from '~/modules/sheet-version/dto/parsed-version.dto'
import { BasePluginEventMessageData } from './base-plugin-event-message-data.dto'


export class SheetVersionBumpPluginEventMessageData extends BasePluginEventMessageData {
  @ValidateNested()
  @Type(() => ApplicationDTO)
  application!: ApplicationDTO

  @ValidateNested()
  @Type(() => SheetDTO)
  sheet!: SheetDTO

  @ValidateNested()
  @Type(() => ParsedVersionDTO)
  version!: ParsedVersionDTO
}
