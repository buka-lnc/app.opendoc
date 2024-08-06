import { IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CompilerOptionDefinition } from './compiler-option-definition'
import { TakeType } from '@miaooo/nestjs-take-type'
import { Compiler } from '../entities/compiler.entity'


export class CompilerInformation extends TakeType(
  Compiler,
  ['name', 'version'],
  ['description', 'author']
) {
  /**
   * 兼容的 OpenDoc API 版本
   * 遵守 semver 规范 https://www.npmjs.com/package/semver
   *
   * @example '^1'
   */
  @IsString()
  apiVersion!: string

  /**
   * Compiler 选项
   */
  @ValidateNested()
  @Type(() => CompilerOptionDefinition)
  options?: CompilerOptionDefinition[]
}
