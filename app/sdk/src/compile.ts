import { compileAsyncapi } from './compile-asyncapi'
import { compileOpenapi } from './compile-openapi'
import { compileProject } from './compile-project'
import { CompileOptions } from './interface/compile-options'
import { Filetype } from './interface/filetype'


export async function compile(options: CompileOptions): Promise<void> {
  if (options.filetype === Filetype.openapi) {
    await compileOpenapi(options)
  } else if (options.filetype === Filetype.asyncapi) {
    await compileAsyncapi(options)
  } else {
    throw new Error('Unsupported file type')
  }

  if (options.project) {
    if (options.project === true) {
      await compileProject({
        name: options.moduleName,
        outdir: options.outdir,
      })
    } else {
      await compileProject({
        name: options.project.name ?? options.moduleName,
        outdir: options.outdir,
        version: options.project.version,
      })
    }
  }
}
