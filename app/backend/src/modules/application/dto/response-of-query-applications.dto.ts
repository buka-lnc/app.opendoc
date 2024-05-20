import { ApplicationDTO } from './application.dto'
import { ResponseOfType } from '~/type-helpers/response-of'


export class ResponseOfQueryApplicationsDTO extends ResponseOfType(ApplicationDTO) {
}
