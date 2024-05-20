import { PickType } from '@nestjs/swagger'
import { Application } from '../entity/application.entity'

export class ApplicationIdReferenceDTO extends PickType(Application, ['id']) {
}
