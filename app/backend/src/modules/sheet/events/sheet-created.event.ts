import { Sheet } from '../entities/sheet.entity'


export class SheetCreatedEvent {
  constructor(
    public sheet: Sheet
  ) {
  }
}

