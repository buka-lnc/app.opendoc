/**
 * @interface PluginEventMessage
 * @export
 */
export interface PluginEventMessage {
  "event": "sheet-version-bump" | "sdk-created" | "terminated"
  "data": {
  }
}
