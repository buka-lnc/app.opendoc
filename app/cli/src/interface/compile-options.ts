import { BuildOptions } from './build-options'
import { OpenAPIV3 } from 'openapi-types'


export interface CompileOptions extends Required<Pick<BuildOptions, 'fileNamingStyle' | 'outdir' | 'strict'>> {
  moduleName: string
  document: OpenAPIV3.Document
}
