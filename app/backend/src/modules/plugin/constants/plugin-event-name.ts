/**
 * Opendoc 发出的事件
 */
export enum PluginEventName {
  // Sheet创建成功
  SHEET_CREATED = 'sheet-created',
  // Sheet删除成功
  SHEET_DELETED = 'sheet-deleted',
  // Sheet发布新版本
  SHEET_VERSION_BUMP = 'sheet-version-bump',

  // Sdk创建成功
  SDK_CREATED = 'sdk-created',
  // Sdk更新成功
  SDK_UPDATED = 'sdk-updated',
  // Sdk删除成功
  SDK_DELETED = 'sdk-deleted',

  // 文件创建成功
  API_FILE_CREATED = 'api-file-created',
  // 文件更新成功
  API_FILE_UPDATED = 'api-file-updated',
  // 文件删除成功
  API_FILE_DELETED = 'api-file-deleted',

  // Opendoc 即将立即终止 Websocket 连接
  TERMINATED = 'terminated',
}
