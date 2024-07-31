import { IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CompilerIntroductionOptionDTO } from './compiler-introduction-option.dto'


export class CompilerIntroductionDTO {
  /**
   * Compiler 名称
   */
  @IsString()
  name!: string

  /**
   * Compiler 版本
   */
  @IsString()
  version!: string

  /**
   * Compiler 描述
   */
  @IsString()
  description?: string

  /**
   * Compiler 作者
   */
  @IsString()
  author?: string

  /**
   * Compiler 选项
   */
  @ValidateNested()
  @Type(() => CompilerIntroductionOptionDTO)
  options?: CompilerIntroductionOptionDTO[]
}
