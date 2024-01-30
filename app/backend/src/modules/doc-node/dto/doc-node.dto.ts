import { IsString, ValidateNested } from 'class-validator'
import { ApiDocDto } from '~/modules/api-doc/dto/api-doc.dto'

export class DocNodeDto {
  // /**
  //  * TODO: 可能不需要这个属性，可以用mpath代替
  //  * 唯一标识
  //  * 全局唯一
  //  */
  // @IsString()
  // id: string

  /**
   * 唯一编码
   * 同层级唯一
   */
  @IsString()
  code: string

  /**
   * 路径
   */
  mpath: string

  /**
   * 标题
   */
  @IsString()
  title?: string

  /**
   * 节点关联的接口文档列表
   */
  apiDocs?: ApiDocDto[]

  @ValidateNested()
  children?: DocNodeDto[]
}
