import { IsString, IsUrl } from 'class-validator'

export class PackageMetadataVersionDistDTO {
  @IsString()
  integrity!: string

  @IsUrl()
  tarball!: string
}
