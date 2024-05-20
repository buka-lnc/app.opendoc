import { PickType } from '@nestjs/swagger'
import { SheetPullCrontab } from '../entity/sheet-pull-crontab.entity'


export class SheetPullCrontabDTO extends PickType(SheetPullCrontab, ['url']) {
}
