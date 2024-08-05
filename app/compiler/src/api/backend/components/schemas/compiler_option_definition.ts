/**
 * @interface CompilerOptionDefinition
 * @export
 */
export interface CompilerOptionDefinition {
  "label"?: string
  "description"?: string
  "key": string
  "format": "string" | "number" | "boolean"
  "value"?: string
}
