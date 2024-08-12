import { Module } from '@nestjs/common'
import { AsyncapiSheetService } from './asyncapi-sheet.service'


@Module({
  imports: [],
  providers: [AsyncapiSheetService],
})
export class AsyncapiSheetModule {}
