import { OmitType } from '@nestjs/swagger'
import { Application } from '../entity/application.entity'


export class ApplicationDTO extends OmitType(Application, ['sheets']) {
}
