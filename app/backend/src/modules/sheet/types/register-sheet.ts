import { Sheet } from '../entities/sheet.entity'
import { SheetVersion } from '~/modules/sheet-version/entities/sheet-version.entity'
import { Application } from '~/modules/application/entities/application.entity'


export interface RegisterSheet extends Required<Pick<Sheet, 'code' | 'type'>>, Partial<Pick<Sheet, 'order' | 'title' | 'mode' | 'pullCrontab'>> {
  application: Application

  version?: SheetVersion
}
