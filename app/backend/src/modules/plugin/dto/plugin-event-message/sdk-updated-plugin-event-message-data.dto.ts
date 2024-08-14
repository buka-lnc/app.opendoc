import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { SdkDTO } from '~/modules/sdk/dto/sdk.dto'
import { ParsedVersionDTO } from '~/modules/sheet-version/dto/parsed-version.dto'
import { BasePluginEventMessageData } from './base-plugin-event-message-data.dto'


export class SdkUpdatedPluginEventMessageData extends BasePluginEventMessageData {
  @ValidateNested()
  @Type(() => SdkDTO)
  sdk!: SdkDTO

  @ValidateNested()
  @Type(() => ParsedVersionDTO)
  version!: ParsedVersionDTO
}
