import { SheetVersion } from '../entity/sheet-version.entity'
import { PickType } from '@nestjs/swagger'

export class ParsedVersionDTO extends PickType(SheetVersion, ['major', 'minor', 'patch', 'tag', 'prerelease']) {

}
