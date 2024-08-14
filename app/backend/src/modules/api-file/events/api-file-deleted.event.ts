import { EntityDTO, Loaded } from '@mikro-orm/core'
import { ApiFile } from '../entities/api-file.entity'


export class ApiFileDeletedEvent {
  constructor(
    public apiFile: EntityDTO<Loaded<ApiFile>>
  ) {
  }
}
