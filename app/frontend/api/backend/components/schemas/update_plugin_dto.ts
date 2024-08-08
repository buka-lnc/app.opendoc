import type { UpdatePluginOptionDTO } from "./update_plugin_option_dto"


/**
 * @interface UpdatePluginDTO
 * @export
 */
export interface UpdatePluginDTO {
  /**
   * 编译器状态
   */
  "status"?: "disabled" | "enabled"
  "options"?: (UpdatePluginOptionDTO)[]
}
