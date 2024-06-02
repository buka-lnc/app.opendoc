import { OmitType, PartialType } from '@nestjs/swagger'
import { SheetPullCrontabDTO } from './sheet-pull-crontab.dto'
import { Type } from 'class-transformer'
import { IsOptional, IsString, ValidateNested } from 'class-validator'
import { CreateSheetDTO } from './create-sheet.dto'
import { SheetType } from '../constants/sheet-type.enum'
import { SheetMode } from '../constants/sheet-mode.enum'


export class UpdateSheetDTO extends PartialType(OmitType(CreateSheetDTO, ['code', 'application'])) {
  @IsOptional()
  @IsString()
  order?: number

  @IsOptional()
  type?: SheetType

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  mode?: SheetMode

  @IsOptional()
  @Type(() => SheetPullCrontabDTO)
  @ValidateNested()
  pullCrontab?: SheetPullCrontabDTO
}
