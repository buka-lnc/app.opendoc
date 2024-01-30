import { IsEnum, IsString } from 'class-validator'
import { API_DOC_TYPE } from '../constants/api-doc-type.enum'


export class ApiDocDto {
  @IsEnum(API_DOC_TYPE)
  type: API_DOC_TYPE

  @IsString()
  code: string

  @IsString()
  title?: string

  openapi?: any

  asyncapi?: any
}
