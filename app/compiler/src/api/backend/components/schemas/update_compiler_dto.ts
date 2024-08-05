import type { UpdateCompilerOptionDTO } from "./update_compiler_option_dto"


/**
 * @interface UpdateCompilerDTO
 * @export
 */
export interface UpdateCompilerDTO {
  /**
   * 编译器状态
   */
  "status"?: "disabled" | "enabled"
  "options"?: (UpdateCompilerOptionDTO)[]
}
