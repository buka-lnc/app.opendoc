import { OmitType, PartialType } from '@nestjs/swagger'
import { SheetPullCrontabDTO } from './sheet-pull-crontab.dto'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { CreateSheetDTO } from './create-sheet.dto'


export class UpdateSheetDTO extends PartialType(OmitType(CreateSheetDTO, ['code', 'application'])) {
  @IsOptional()
  order?

  @IsOptional()
  type?

  @IsOptional()
  title?

  @IsOptional()
  mode?

  @IsOptional()
  @Type(() => SheetPullCrontabDTO)
  @ValidateNested()
  pullCrontab?: SheetPullCrontabDTO
}
