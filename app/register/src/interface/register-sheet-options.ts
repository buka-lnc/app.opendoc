export interface RegisterSheetBaseOptions {
  title?: string
  code: string
  order?: number
  tag?: string
}

export type RegisterOpenapiSheetOptions =
  RegisterSheetBaseOptions
  & { type: 'openapi'}
  & ({ file: string | object | Buffer } | { filepath: string })

export type RegisterMarkdownSheetOptions =
  RegisterSheetBaseOptions
  & {type: 'markdown'}
  & ({ glob: string })

export type RegisterAsyncapiSheetOptions =
  RegisterSheetBaseOptions
  & {type: 'asyncapi'}
  & ({ file: string | object | Buffer } | { filepath: string })

export type RegisterSheetOptions = RegisterOpenapiSheetOptions | RegisterMarkdownSheetOptions | RegisterAsyncapiSheetOptions
