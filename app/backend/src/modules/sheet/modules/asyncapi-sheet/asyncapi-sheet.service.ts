import { TypeSheet } from './../../types/type-sheet'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'


@Injectable()
export class AsyncapiSheetService implements TypeSheet {
  constructor(
    @InjectPinoLogger(AsyncapiSheetService.name)
    private readonly logger: PinoLogger
  ) {}

  bumpSheetVersion(): 'major' | 'minor' | 'patch' {
    return 'patch'
  }
}
