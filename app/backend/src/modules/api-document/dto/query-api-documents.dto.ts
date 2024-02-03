import { IsString } from 'class-validator'

export class QueryApiDocumentsDTO {
  @IsString()
  folderId: string
}
