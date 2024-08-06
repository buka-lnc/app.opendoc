import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { SdkDTO } from '~/modules/sdk/dto/sdk.dto'
import { Compiler } from '../entities/compiler.entity'


export class SdkCreatedEventMessageDataDTO {
  @ValidateNested()
  @Type(() => SdkDTO)
  sdk!: SdkDTO


  @ValidateNested()
  @Type(() => Compiler)
  compiler!: Compiler
}
