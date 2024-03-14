import { Split } from '@buka/class-transformer-extra'
import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class QueryApiDocumentFilesDTO {
  @Split(',')
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @Split(',')
  @IsNumberString({}, { each: true })
  @IsOptional()
  apiDocumentIds!: string[]
}
