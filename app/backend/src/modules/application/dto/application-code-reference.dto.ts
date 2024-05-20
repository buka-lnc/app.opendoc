import { PickType } from '@nestjs/swagger'
import { Application } from '../entity/application.entity'

export class ApplicationCodeReferenceDTO extends PickType(Application, ['code']) {
}
