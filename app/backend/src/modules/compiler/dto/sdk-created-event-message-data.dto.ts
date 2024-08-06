import { Type } from 'class-transformer'
import { IsString, ValidateNested } from 'class-validator'
import { SdkDTO } from '~/modules/sdk/dto/sdk.dto'
import { Compiler } from '../entities/compiler.entity'
import { ParsedVersionDTO } from '~/modules/sheet-version/dto/parsed-version.dto'


export class SdkCreatedEventMessageDataDTO {
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

  @ValidateNested()
  @Type(() => Compiler)
  compiler!: Compiler
}
