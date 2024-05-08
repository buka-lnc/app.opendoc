export interface RegisterApiDocumentBaseOptions {
  title?: string
  code: string
  order?: number
}

export type RegisterOpenapiDocumentOptions =
  RegisterApiDocumentBaseOptions
  & { type: 'openapi'}
  & ({ file: string | object | Buffer } | { filepath: string })

export type RegisterMarkdownDocumentOptions =
  RegisterApiDocumentBaseOptions
  & {type: 'markdown'}
  & ({ file: string | Buffer } | { filepath: string })

export type RegisterAsyncapiDocumentOptions =
  RegisterApiDocumentBaseOptions
  & {type: 'asyncapi'}
  & ({ file: string | object | Buffer } | { filepath: string })

export type RegisterApiDocumentOptions = RegisterOpenapiDocumentOptions | RegisterMarkdownDocumentOptions | RegisterAsyncapiDocumentOptions
