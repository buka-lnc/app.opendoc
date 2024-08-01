import type { CompilerIntroductionOptionDTO } from "./compiler_introduction_option_dto"


/**
 * @interface CompilerIntroductionDTO
 * @export
 */
export interface CompilerIntroductionDTO {
  /**
   * 编译器描述
   */
  "description"?: {
  }
  /**
   * 编译器名称
   */
  "author"?: {
  }
  /**
   * 编译器名称
   */
  "name": string
  /**
   * 编译器版本
   */
  "version": string
  /**
   * Compiler 选项
   */
  "options"?: (CompilerIntroductionOptionDTO)[]
}
