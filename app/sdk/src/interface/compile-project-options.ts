import { Type, type Static } from '@sinclair/typebox'


export const CompileProjectOptions = Type.Object({
  outdir: Type.String({ default: `${process.cwd()}/api` }),
  name: Type.String(),
  version: Type.Optional(Type.String({ default: '0.0.1' })),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CompileProjectOptions = Static<typeof CompileProjectOptions>
