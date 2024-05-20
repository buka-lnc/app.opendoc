import { IsNumberString } from 'class-validator'

export class EntityReferenceDTO {
  @IsNumberString()
  id!: string
}
