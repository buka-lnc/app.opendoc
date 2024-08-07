/**
 * @interface CompilerEventMessageDTO
 * @export
 */
export interface CompilerEventMessageDTO {
  "event": "compiler-join" | "sheet-version-bump" | "sdk-created" | "terminated" | "compiler-information" | "create-sdk" | "update-sdk"
  "data": {
  }
}
