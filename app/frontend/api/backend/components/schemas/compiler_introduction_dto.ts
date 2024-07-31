import type { CompilerIntroductionOptionDTO } from "./compiler_introduction_option_dto"


/**
 * @interface CompilerIntroductionDTO
 * @export
 */
export interface CompilerIntroductionDTO {
  /**
   * Compiler 名称
   */
  "name": string
  /**
   * Compiler 版本
   */
  "version": string
  /**
   * Compiler 描述
   */
  "description"?: string
  /**
   * Compiler 作者
   */
  "author"?: string
  /**
   * Compiler 选项
   */
  "options"?: (CompilerIntroductionOptionDTO)[]
}
