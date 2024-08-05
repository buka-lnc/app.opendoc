/**
 * @interface CompilerEventMessageDTO
 * @export
 */
export interface CompilerEventMessageDTO {
  "id": string
  "event": "compiler-join" | "sheet-version-bump" | "sdk-created" | "terminated" | "compiler-join-ack" | "create-sdk" | "update-sdk"
  "data": {
  }
}
