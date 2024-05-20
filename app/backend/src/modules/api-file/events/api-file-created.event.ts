import { ApiFile } from '../entities/api-file.entity'

export class ApiFileCreatedEvent {
  constructor(
    public apiFile: ApiFile
  ) {
  }
}
