import { Type, type Static } from '@sinclair/typebox'
import { FileNamingStyle } from './file-naming-style'
import { CompileProjectOptions } from './compile-project-options'
import { Compiler } from './compiler'


export const BuildOptions = Type.Object({
  strict: Type.Boolean({ default: false }),
  outdir: Type.String({ default: `${process.cwd()}/api` }),
  fileNamingStyle: Type.Enum(FileNamingStyle, { default: FileNamingStyle.snakeCase }),
  moduleName: Type.String(),
  filepath: Type.String(),

  compiler: Type.Enum(Compiler),

  project: Type.Optional(Type.Union([
    Type.Const<false>(false),
    Type.Omit(CompileProjectOptions, ['outdir']),
  ], { default: false })),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BuildOptions = Static<typeof BuildOptions>
