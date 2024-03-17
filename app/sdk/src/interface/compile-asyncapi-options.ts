import { CompileOptions } from './compile-options'


export type CompileAsyncapiOptions = Omit<CompileOptions, 'filetype' | 'project'>
