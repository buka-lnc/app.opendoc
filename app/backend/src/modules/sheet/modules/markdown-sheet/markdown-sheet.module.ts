import { Module } from '@nestjs/common'
import { MarkdownSheetService } from './markdown-sheet.service'


@Module({
  imports: [],
  providers: [MarkdownSheetService],
})
export class MarkdownSheetModule {}
