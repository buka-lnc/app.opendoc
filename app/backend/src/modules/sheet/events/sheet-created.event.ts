import { EntityDTO, Loaded } from '@mikro-orm/core'
import { Sheet } from '../entities/sheet.entity'


export class SheetCreatedEvent {
  constructor(
    public sheet: EntityDTO<Loaded<Sheet>>,
  ) {
  }
}

