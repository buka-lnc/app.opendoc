/**
 * @interface PluginLogs
 * @export
 */
export interface PluginLogs {
  "level": "info" | "warn" | "error" | "debug"
  "datetime": string
  "message": string
}
