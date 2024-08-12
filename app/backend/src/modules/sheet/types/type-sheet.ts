import { SheetVersion } from '~/modules/sheet-version/entities/sheet-version.entity'
import { Sheet } from '../entities/sheet.entity'

export interface TypeSheet {
  bumpSheetVersion(sheet: Sheet, tag?: string): Promise<SheetVersion>
}
