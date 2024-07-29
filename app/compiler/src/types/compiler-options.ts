/* eslint-disable @typescript-eslint/no-redeclare */
import { Type, type Static } from '@sinclair/typebox'


export const CompilerOptions = Type.Object({
  register: Type.String(),
})

export type CompilerOptions = Static<typeof CompilerOptions>
