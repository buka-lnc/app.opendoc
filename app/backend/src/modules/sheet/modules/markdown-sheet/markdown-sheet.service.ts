import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { TypeSheet } from '../../types/type-sheet'


@Injectable()
export class MarkdownSheetService implements TypeSheet {
  constructor(
    @InjectPinoLogger(MarkdownSheetService.name)
    private readonly logger: PinoLogger
  ) {}

  bumpSheetVersion(): 'major' | 'minor' | 'patch' {
    return 'patch'
  }
}
