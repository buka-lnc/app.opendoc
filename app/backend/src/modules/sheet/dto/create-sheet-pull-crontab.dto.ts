import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PickType } from '@nestjs/swagger'
import { Sheet } from '../entities/sheet.entity'
import { Property, RequiredEntityData } from '@mikro-orm/core'
import { SheetPullCrontabDTO } from './sheet-pull-crontab.dto'


export class CreateSheetPullCrontabDTO extends SheetPullCrontabDTO {
  @Property({
    type: () => PickType(Sheet, ['id']),
  })
  @Type(() => PickType(Sheet, ['id']))
  @ValidateNested()
  sheet!: RequiredEntityData<Sheet, never, false>
}
