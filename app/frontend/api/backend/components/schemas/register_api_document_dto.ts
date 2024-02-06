/**
 * @interface RegisterApiDocumentDTO
 * @export
 */
export interface RegisterApiDocumentDTO {
  apiDocumentFile?: {
    /**
     * @type binary
     */
    file?: string
  }
  applicationCode: string
  apiDocumentCode: string
  apiDocumentType?: "markdown" | "openapi" | "asyncapi"
  apiDocumentTitle?: string
  apiDocumentCronSyncUrl?: string
  apiDocumentOrder?: number
}
