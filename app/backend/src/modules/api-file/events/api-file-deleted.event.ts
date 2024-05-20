import { ApiFile } from '../entities/api-file.entity'

export class ApiFileDeletedEvent {
  constructor(
    public apiFile: ApiFile
  ) {
  }
}
