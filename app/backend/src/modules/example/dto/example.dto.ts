import { IsNumberString, IsOptional, IsString } from "class-validator";


export class ExampleDTO {
  @IsNumberString()
  id: string

  @IsString()
  @IsOptional()
  name: string
}
