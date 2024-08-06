/**
 * @interface CompilerEventMessageDTO
 * @export
 */
export interface CompilerEventMessageDTO {
  "id": string
  "event": "compiler-join" | "sheet-version-bump" | "sdk-created" | "terminated" | "compiler-information" | "create-sdk" | "update-sdk"
  "data": {
  }
}
