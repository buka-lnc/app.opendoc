import { EntityDTO, Loaded } from '@mikro-orm/core'
import { Sheet } from '../entities/sheet.entity'


export class SheetDeletedEvent {
  constructor(
    public sheet: EntityDTO<Loaded<Sheet>>,
  ) {
  }
}


