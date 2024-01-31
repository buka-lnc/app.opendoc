import { TakeType } from '@miaooo/nestjs-take-type'
import { Folder } from '../entities/folder.entity'


export class RegisterFolderDto extends TakeType(Folder, ['mpath'], ['title']) {
}
