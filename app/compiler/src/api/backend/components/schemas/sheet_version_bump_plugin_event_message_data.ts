import type { ApplicationDTO } from "./application_dto"
import type { SheetDTO } from "./sheet_dto"
import type { ParsedVersionDTO } from "./parsed_version_dto"
import type { Plugin } from "./plugin"


/**
 * @interface SheetVersionBumpPluginEventMessageData
 * @export
 */
export interface SheetVersionBumpPluginEventMessageData {
  "application": ApplicationDTO
  "sheet": SheetDTO
  "version": ParsedVersionDTO
  "plugin": Plugin
}
