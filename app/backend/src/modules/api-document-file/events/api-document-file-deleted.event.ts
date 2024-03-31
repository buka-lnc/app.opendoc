import { ApiDocumentFile } from '../entities/api-document-file.entity'

export class ApiDocumentFileDeletedEvent {
  constructor(
    public apiDocumentFile: ApiDocumentFile
  ) {
  }
}
