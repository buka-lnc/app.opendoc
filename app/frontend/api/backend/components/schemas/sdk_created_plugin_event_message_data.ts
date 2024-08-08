import type { SdkDTO } from "./sdk_dto"
import type { ParsedVersionDTO } from "./parsed_version_dto"
import type { Plugin } from "./plugin"


/**
 * @interface SdkCreatedPluginEventMessageData
 * @export
 */
export interface SdkCreatedPluginEventMessageData {
  "sdk": SdkDTO
  "version": ParsedVersionDTO
  /**
   * tgz 压缩文件
   * sdk对应的sheet版本的tgz压缩文件
   */
  "apiFilesRaw": string
  "plugin": Plugin
}
