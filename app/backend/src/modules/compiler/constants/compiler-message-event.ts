export enum CompilerEvent {
  // 以下为编译器接受的事件
  // 请求编译器加入
  COMPILER_JOIN = 'compiler-join',
  // Sheet发布新版本
  SHEET_VERSION_BUMP = 'sheet-version-bump',
  // Sdk创建成功
  SDK_CREATED = 'sdk-created',
  // 即将立即终止Websocket连接
  TERMINATED = 'terminated',

  // 以下为编译器发送事件
  // Websocket 建立链接后立刻立刻发送编译器自述JSON
  COMPILER_INFORMATION = 'compiler-information',
  // 创建Sdk
  CREATE_SDK = 'create-sdk',
  // 更新Sdk
  UPDATE_SDK = 'update-sdk',
}
