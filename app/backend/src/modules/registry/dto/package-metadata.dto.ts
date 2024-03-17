import { IsString } from 'class-validator'
import { PackageMetadataVersionDTO } from './package-metadata-version.dto'


export class PackageMetadataDTO {
  @IsString()
  name!: string

  'dist-tags'!: Record<string, string>

  time!: Record<string, string>

  versions!: Record<string, PackageMetadataVersionDTO>
}
