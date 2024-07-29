import { IsString } from 'class-validator'

export class CompilerMessageDTO {
  @IsString()
  id!: string

  @IsString()
  event!: string

  data!: any
}
