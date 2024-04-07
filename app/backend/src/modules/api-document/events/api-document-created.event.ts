import { ApiDocument } from '../entities/api-document.entity'


export class ApiDocumentCreatedEvent {
  constructor(
    public apiDocument: ApiDocument
  ) {
  }
}

