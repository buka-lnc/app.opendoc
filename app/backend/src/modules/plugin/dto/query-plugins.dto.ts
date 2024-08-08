import { PartialType } from '@nestjs/swagger'
import { PaginationDTO } from '~/dto/pagination.dto'


export class QueryPluginsDTO extends PartialType(PaginationDTO) {
}
