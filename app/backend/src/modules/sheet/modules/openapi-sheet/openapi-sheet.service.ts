import { Injectable } from '@nestjs/common'
import { TypeSheet } from '../../types/type-sheet'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'


@Injectable()
export class OpenapiSheetService implements TypeSheet {
  constructor(
    @InjectPinoLogger(OpenapiSheetService.name)
    private readonly logger: PinoLogger
  ) {}

  bumpSheetVersion(): 'major' | 'minor' | 'patch' {
    return 'patch'
  }
}
