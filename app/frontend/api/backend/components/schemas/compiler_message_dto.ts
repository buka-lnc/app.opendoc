/**
 * @interface CompilerMessageDTO
 * @export
 */
export interface CompilerMessageDTO {
  "id": string
  "event": "introduce" | "icon" | "compile" | "update-sdk"
  "data": {
  }
}
