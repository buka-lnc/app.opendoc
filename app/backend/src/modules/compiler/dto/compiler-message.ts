import { IsString } from 'class-validator'

export class CompilerMessage {
  @IsString()
  event!: string

  data: any
}
