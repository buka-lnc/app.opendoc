import type { SheetVersion } from "./sheet_version"
import type { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface Sdk
 * @export
 */
export interface Sdk {
  /**
   * Npm完整包名
   */
  "fullName": string
  /**
   * 版本号
   */
  "version": SheetVersion
  /**
   * 所属文档
   */
  "sheet": EntityReferenceDTO
  /**
   * 关联的文档文件
   */
  "apiFile": EntityReferenceDTO
  "scope": string
  /**
   * Npm包名
   */
  "name": string
  "compiler": "openapi-core" | "openapi-react" | "openapi-vue" | "asyncapi-core"
  /**
   * sdk 可用状态
   */
  "status": "pending" | "compiling" | "published" | "error"
  /**
   * @type date-time
   * 发布时间
   */
  "publishedAt"?: string
  /**
   * Npm 压缩包
   */
  "tarball"?: string
  /**
   * Npm 压缩包的sha512
   */
  "integrity"?: string
  /**
   * 主键
   */
  "id": string
  /**
   * @type date-time
   * 创建时间
   */
  "createdAt": string
  /**
   * @type date-time
   * 更新时间
   */
  "updatedAt": string
}
