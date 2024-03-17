import { BuildOptions } from './build-options'
import { OpenAPIV3 } from 'openapi-types'


export interface CompileOptions extends Required<Omit<BuildOptions, 'filepath' | 'project'>>, Pick<BuildOptions, 'project'> {
  document: OpenAPIV3.Document
}
