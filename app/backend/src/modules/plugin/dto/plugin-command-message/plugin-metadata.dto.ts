import { IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PluginOptionDefinition } from '../plugin-option-definition'
import { TakeType } from '@miaooo/nestjs-take-type'
import { Plugin } from '../../entities/plugin.entity'


/**
 * 描述Plugin的元数据文件
 * Plugin 需要再接收到 WebSocket 连接后立刻发送 Join 命令并携带 PluginMetadata
 */
export class PluginMetadata extends TakeType(
  Plugin,
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
   * Plugin 选项
   */
  @ValidateNested()
  @Type(() => PluginOptionDefinition)
  options?: PluginOptionDefinition[]
}
