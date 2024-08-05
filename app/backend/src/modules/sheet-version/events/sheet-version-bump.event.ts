import { SheetVersion } from '~/modules/sheet-version/entities/sheet-version.entity'


export class SheetVersionBumpEvent {
  constructor(
    public sheetVersion: SheetVersion
  ) {
  }
}

