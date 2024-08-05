import { OmitType } from '@nestjs/swagger'
import { Sheet } from '../entities/sheet.entity'


export class SheetDTO extends OmitType(Sheet, ['application', 'apiFiles', 'sdks', 'pullCrontab', 'versions']) {

}
