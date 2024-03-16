import { Type, type Static } from '@sinclair/typebox'
import { FileNamingStyle } from './file-naming-style'


export const BuildOptions = Type.Object({
  strict: Type.Boolean(),
  outdir: Type.String(),
  fileNamingStyle: Type.Enum(FileNamingStyle, { default: FileNamingStyle.snakeCase }),
  modules: Type.Record(Type.String(), Type.String()),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BuildOptions = Static<typeof BuildOptions>
