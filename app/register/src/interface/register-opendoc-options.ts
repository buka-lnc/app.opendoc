export interface RegisterOpendocOptions {
  server: string

  application: {
    code: string
    title?: string
  }

  apiDocuments: {
    type: 'opendoc' | 'openapi' | 'markdown'
    title?: string
    code: string
    order?: number
    file: string | object | Buffer
  }[]
}
