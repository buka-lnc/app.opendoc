import { IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { SheetPullCrontabDTO } from './sheet-pull-crontab.dto'
import { Sheet } from '../entity/sheet.entity'
import { TakeType } from '@miaooo/nestjs-take-type'
import { ApplicationIdReferenceDTO } from '~/modules/application/dto/application-id-reference.dto'
import { ApplicationCodeReferenceDTO } from '~/modules/application/dto/application-code-reference.dto'
import { ApplicationReference } from '~/modules/application/decorators/application-reference.decorator'
import { ApiExtraModels } from '@nestjs/swagger'


@ApiExtraModels(ApplicationIdReferenceDTO, ApplicationCodeReferenceDTO)
export class CreateSheetDTO extends TakeType(
  Sheet,
  ['code', 'type', 'title', 'mode'],
  ['order'],
) {
  @IsOptional()
  order

  /**
   * 应用编码
   * 将文档创建到哪个应用下
   */
  @ApplicationReference()
  application!: ApplicationIdReferenceDTO | ApplicationCodeReferenceDTO

  /**
   * 文档拉取定时任务(mode = pull)
   */
  @IsOptional()
  @Type(() => SheetPullCrontabDTO)
  @ValidateNested()
  pullCrontab?: SheetPullCrontabDTO
}
