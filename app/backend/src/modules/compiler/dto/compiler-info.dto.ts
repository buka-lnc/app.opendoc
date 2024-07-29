import type { JSONSchema } from 'json-schema-typed'
import { IsString } from 'class-validator'

export class CompilerInfoDTO {
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
  description!: string

  /**
   * Compiler 作者
   */
  @IsString()
  author!: string

  /**
   * Compiler 配置
   */
  options!: JSONSchema
}
