import { Type } from 'class-transformer'
import { IsString, ValidateNested } from 'class-validator'
import { SdkDTO } from '~/modules/sdk/dto/sdk.dto'
import { ParsedVersionDTO } from '~/modules/sheet-version/dto/parsed-version.dto'
import { BasePluginEventMessageData } from './base-plugin-event-message-data.dto'


export class SdkCreatedPluginEventMessageData extends BasePluginEventMessageData {
  @ValidateNested()
  @Type(() => SdkDTO)
  sdk!: SdkDTO

  @ValidateNested()
  @Type(() => ParsedVersionDTO)
  version!: ParsedVersionDTO

  /**
   * tgz 压缩文件
   * sdk对应的sheet版本的tgz压缩文件
   */
  @IsString()
  apiFilesRaw!: string
}
