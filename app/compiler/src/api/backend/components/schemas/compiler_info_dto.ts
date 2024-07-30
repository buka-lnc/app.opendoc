import type { CompilerInfoOptionDTO } from "./compiler_info_option_dto"


/**
 * @interface CompilerInfoDTO
 * @export
 */
export interface CompilerInfoDTO {
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
  "options"?: (CompilerInfoOptionDTO)[]
}
