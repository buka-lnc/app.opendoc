import { PickType } from '@nestjs/swagger'
import { Application } from '../entities/application.entity'

export class ApplicationIdReferenceDTO extends PickType(Application, ['id']) {
}
