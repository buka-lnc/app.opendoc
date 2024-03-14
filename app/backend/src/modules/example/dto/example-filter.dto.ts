import { TakeType } from '@miaooo/nestjs-take-type'
import { ExampleDTO } from './example.dto'

export class ExampleFilterDTO extends TakeType(ExampleDTO, [], ['name']) {
}
