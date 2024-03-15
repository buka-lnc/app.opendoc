export class ApiDocumentFileCreatedEvent {
  apiDocumentFileId: string

  constructor(apiDocumentFileId: string) {
    this.apiDocumentFileId = apiDocumentFileId
  }
}
