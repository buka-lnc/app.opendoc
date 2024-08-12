import { Module } from '@nestjs/common'
import { OpenapiSheetService } from './openapi-sheet.service'


@Module({
  imports: [],
  providers: [OpenapiSheetService],
})
export class OpenapiSheetModule {}
