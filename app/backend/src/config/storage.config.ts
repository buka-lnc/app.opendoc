import { Configuration } from '@buka/nestjs-config'
import { IsEnum, IsString, Length, ValidateIf } from 'class-validator'
import { StorageConfigType } from '~/constants/storage-config-type.enum'

@Configuration('storage')
export class StorageConfig {
  @IsEnum(StorageConfigType)
  type: StorageConfigType = StorageConfigType.Disk

  @IsString()
  directory: string = './storage'

  @IsString()
  @ValidateIf((o) => o.type === StorageConfigType.Oss)
  ossRegion!: string

  @IsString()
  @ValidateIf((o) => o.type === StorageConfigType.Oss)
  ossEndpoint!: string

  @IsString()
  @ValidateIf((o) => o.type === StorageConfigType.Oss)
  ossAccessKeyId!: string

  @IsString()
  @ValidateIf((o) => o.type === StorageConfigType.Oss)
  ossAccessKeySecret!: string

  @IsString()
  @ValidateIf((o) => o.type === StorageConfigType.Oss)
  @Length(1, 63)
  ossBucket!: string
}
