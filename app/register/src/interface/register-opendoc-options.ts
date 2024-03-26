export interface RegisterOpendocOptions {
  server: string

  application: {
    code: string
    title?: string
  }

  apiDocuments: {
    type: 'asyncapi' | 'openapi' | 'markdown'
    title?: string
    code: string
    order?: number
    file: string | object | Buffer
  }[]
}
