export enum CompilerEvent {
  // 以下为编译器接受的事件
  COMPILER_JOIN = 'compiler-join',
  SHEET_VERSION_BUMP = 'sheet-version-bump',
  SDK_CREATED = 'sdk-created',
  TERMINATED = 'terminated',

  // 以下为编译器发送事件
  COMPILER_JOIN_ACK = 'compiler-join-ack',
  CREATE_SDK = 'create-sdk',
  UPDATE_SDK = 'update-sdk',
}
