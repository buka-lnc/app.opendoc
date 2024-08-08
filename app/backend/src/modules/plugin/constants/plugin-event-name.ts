/**
 * Opendoc 发出的事件
 */
export enum PluginEventName {
  // Sheet发布新版本
  SHEET_VERSION_BUMP = 'sheet-version-bump',

  // Sdk创建成功
  SDK_CREATED = 'sdk-created',

  // Opendoc 即将立即终止 Websocket 连接
  TERMINATED = 'terminated',
}
