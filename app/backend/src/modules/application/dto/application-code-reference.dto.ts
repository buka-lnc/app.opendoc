import { PickType } from '@nestjs/swagger'
import { Application } from '../entities/application.entity'

export class ApplicationCodeReferenceDTO extends PickType(Application, ['code']) {
}
