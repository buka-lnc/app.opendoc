import { Type, type Static } from '@sinclair/typebox'
import { FileNamingStyle } from './file-naming-style'
import { Filetype } from './filetype'
import { CompileProjectOptions } from './compile-project-options'


export const BuildOptions = Type.Object({
  strict: Type.Boolean({ default: false }),
  outdir: Type.String({ default: `${process.cwd()}/api` }),
  fileNamingStyle: Type.Enum(FileNamingStyle, { default: FileNamingStyle.snakeCase }),
  moduleName: Type.String(),
  filepath: Type.String(),
  filetype: Type.Enum(Filetype),

  project: Type.Optional(Type.Union([
    Type.Boolean(),
    Type.Omit(CompileProjectOptions, ['outdir']),
  ])),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BuildOptions = Static<typeof BuildOptions>
