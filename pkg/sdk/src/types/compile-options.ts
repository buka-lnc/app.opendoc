import { BuildOptions } from './build-options'


export interface CompileOptions extends Required<Omit<BuildOptions, 'filepath' | 'project'>>, Pick<BuildOptions, 'project'> {
  document: any
}
