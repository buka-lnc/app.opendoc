/**
 * @interface RegisterApiDocumentDTO
 * @export
 */
export interface RegisterApiDocumentDTO {
  file?: {
    /**
     * @type binary
     */
    file?: string
  }
  folderMpath: string
  title?: string
  cronSyncUrl?: string
  order?: number
  type: "readme" | "openapi" | "asyncapi"
  code: string
}
