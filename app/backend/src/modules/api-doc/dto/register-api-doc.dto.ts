import { IsString } from 'class-validator'
import { ApiDocDto } from './api-doc.dto'


export class RegisterApiDocDto extends ApiDocDto {
  @IsString()
  docNodeMpath: string
}
