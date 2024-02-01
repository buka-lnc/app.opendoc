import { TakeType } from '@miaooo/nestjs-take-type'
import { Folder } from '../entities/folder.entity'


export class RegisterFolderDTO extends TakeType(Folder, ['mpath'], ['title']) {
}
