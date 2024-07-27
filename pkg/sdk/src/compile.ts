import { compileAsyncapiCore } from './compile-asyncapi-core'
import { compileOpenapiCore } from './compile-openapi-core'
import { compileOpenapiReact } from './compile-openapi-react'
import { compileProject } from './compile-project'
import { CompileOptions } from './types/compile-options'
import { Compiler } from './types/compiler'


export async function compile(options: CompileOptions): Promise<void> {
  if (options.compiler === Compiler.openapiCore) {
    await compileOpenapiCore(options)
  } else if (options.compiler === Compiler.openapiReact) {
    await compileOpenapiReact(options)
  } else if (options.compiler === Compiler.asyncapiCore) {
    await compileAsyncapiCore(options)
  } else {
    throw new Error('Unsupported file type')
  }

  if (options.project) {
    await compileProject({
      name: options.project.name ?? options.moduleName,
      outdir: options.outdir,
      version: options.project.version,
      dependencies: options.project.dependencies,
    })
  }
}
