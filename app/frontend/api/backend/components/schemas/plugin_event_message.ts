/**
 * @interface PluginEventMessage
 * @export
 */
export interface PluginEventMessage {
  "event": "sheet-created" | "sheet-deleted" | "sheet-version-bump" | "sdk-created" | "sdk-updated" | "sdk-deleted" | "api-file-created" | "api-file-updated" | "api-file-deleted" | "terminated"
  "data": {
  }
}
