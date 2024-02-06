import { TakeType } from '@miaooo/nestjs-take-type'
import { Application } from '../entity/application.entity'


export class RegisterApplicationDTO extends TakeType(Application, ['code'], ['title']) {

}
