import { RegisterApplicationOptions } from "./register-application-options"
import { RegisterSheetOptions } from "./register-sheet-options"
import { ServerOptions } from "./server-options"

export interface RegisterOpendocOptions {
  server: ServerOptions
  application: RegisterApplicationOptions
  sheets: RegisterSheetOptions[]
}
