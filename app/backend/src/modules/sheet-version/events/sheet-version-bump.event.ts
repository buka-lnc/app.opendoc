import { EntityDTO, Loaded } from '@mikro-orm/core'
import { SheetVersion } from '../entities/sheet-version.entity'


export class SheetVersionBumpEvent {
  constructor(
    public sheetVersion: EntityDTO<Loaded<SheetVersion>>
  ) {
  }
}

