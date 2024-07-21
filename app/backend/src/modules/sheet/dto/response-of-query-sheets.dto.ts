import { Sheet } from '../entities/sheet.entity'
import { ResponseOfType } from '~/type-helpers/response-of'


export class ResponseOfQuerySheetsDTO extends ResponseOfType(Sheet) {
}
