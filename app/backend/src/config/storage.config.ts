import { Configuration } from '@buka/nestjs-config'
import { IsEnum, IsString } from 'class-validator'
import { StorageConfigType } from '~/constants/storage-config-type.enum'

@Configuration('storage')
export class StorageConfig {
  @IsEnum(StorageConfigType)
  type: StorageConfigType = StorageConfigType.Disk

  @IsString()
  directory: string = './storage'
}
