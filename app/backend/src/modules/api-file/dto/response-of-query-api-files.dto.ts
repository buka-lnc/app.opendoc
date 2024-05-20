import { ApiFile } from '../entities/api-file.entity'
import { ResponseOfType } from '~/type-helpers/response-of'

export class ResponseOfQueryApiFilesDTO extends ResponseOfType(ApiFile) {
}
