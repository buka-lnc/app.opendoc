import { PickType } from '@nestjs/swagger'
import { SheetPullCrontab } from '../entities/sheet-pull-crontab.entity'


export class SheetPullCrontabDTO extends PickType(SheetPullCrontab, ['url']) {
}
