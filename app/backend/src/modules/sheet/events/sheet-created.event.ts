import { Sheet } from '../entity/sheet.entity'


export class SheetCreatedEvent {
  constructor(
    public sheet: Sheet
  ) {
  }
}

