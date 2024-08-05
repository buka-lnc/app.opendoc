import { IsString } from 'class-validator'


export class CompilerMessageDataDTO {
  @IsString()
  $id!: string
}
