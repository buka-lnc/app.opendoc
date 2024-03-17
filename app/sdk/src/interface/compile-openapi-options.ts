import { CompileOptions } from './compile-options'


export type CompileOpenapiOptions = Omit<CompileOptions, 'filetype' | 'project'>
