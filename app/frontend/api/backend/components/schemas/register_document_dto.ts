/**
 * @interface RegisterDocumentDTO
 * @export
 */
export interface RegisterDocumentDTO {
  file: {
    /**
     * @type binary
     */
    file?: string
  }
  folderMpath: string
  title?: string
  cronSyncUrl?: string
  type: "readme" | "openapi" | "asyncapi"
  code: string
}
