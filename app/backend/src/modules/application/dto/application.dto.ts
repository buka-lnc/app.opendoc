import { OmitType } from '@nestjs/swagger'
import { Application } from '../entities/application.entity'


export class ApplicationDTO extends OmitType(Application, ['sheets']) {
}
