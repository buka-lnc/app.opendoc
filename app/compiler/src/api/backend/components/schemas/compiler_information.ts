import type { CompilerOptionDefinition } from "./compiler_option_definition"


/**
 * @interface CompilerInformation
 * @export
 */
export interface CompilerInformation {
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
   * 兼容的 OpenDoc API 版本
   * 遵守 semver 规范 https://www.npmjs.com/package/semver
   */
  "apiVersion": string
  /**
   * Compiler 选项
   */
  "options"?: (CompilerOptionDefinition)[]
}
