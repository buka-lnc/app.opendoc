/**
 * @interface CompilerInfoOptionDTO
 * @export
 */
export interface CompilerInfoOptionDTO {
  "label"?: string
  "description"?: string
  "key": string
  "format": "string" | "number" | "boolean"
  "value"?: string
}
