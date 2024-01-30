import { PickType } from '@nestjs/swagger'
import { DocNodeDto } from './doc-node.dto'


export class RegisterDocNodeDto extends PickType(DocNodeDto, ['code', 'mpath', 'title']) {

}
