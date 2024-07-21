import { Configuration } from '@buka/nestjs-config'
import { IsOptional, IsString } from 'class-validator'

@Configuration('registry')
export class RegistryConfig {
  @IsString()
  url: string = 'https://registry.npmjs.org'

  @IsOptional()
  @IsString()
  authToken?: string
}
