import { RegisterApplicationOptions } from "./register-application-options"
import { RegisterApiDocumentOptions } from "./register-opendoc-api-document-options"

export interface RegisterOpendocOptions {
  server: string
  application: RegisterApplicationOptions
  apiDocuments: RegisterApiDocumentOptions[]
}
