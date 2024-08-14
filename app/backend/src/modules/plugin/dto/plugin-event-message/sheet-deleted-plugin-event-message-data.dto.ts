import { ApplicationDTO } from '~/modules/application/dto/application.dto'
import { SheetDTO } from '~/modules/sheet/dto/sheet.dto'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { BasePluginEventMessageData } from './base-plugin-event-message-data.dto'


export class SheetDeletedPluginEventMessageData extends BasePluginEventMessageData {
  @ValidateNested()
  @Type(() => ApplicationDTO)
  application!: ApplicationDTO

  @ValidateNested()
  @Type(() => SheetDTO)
  sheet!: SheetDTO
}
