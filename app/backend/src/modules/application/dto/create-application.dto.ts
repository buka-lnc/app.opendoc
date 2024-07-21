import { TakeType } from '@miaooo/nestjs-take-type'
import { Application } from '../entities/application.entity'


export class CreateApplicationDTO extends TakeType(Application, ['code'], ['title']) {

}
