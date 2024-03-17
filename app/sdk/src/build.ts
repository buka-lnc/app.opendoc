import { compile } from './compile'
import { BuildOptions } from './interface/build-options'
import { Value } from '@sinclair/typebox/value'
import { readOpenapiFile } from './utils/read-openapi-file'
import { CompileOptions } from './interface/compile-options'


export async function build(options: BuildOptions): Promise<void> {
  if (!Value.Check(BuildOptions, options)) {
    const errors = [...Value.Errors(BuildOptions, options)]
    const message = errors.map((error) => `${error.path}: ${error.message}`).join('\n')
    throw TypeError(message)
  }

  const document = await readOpenapiFile(options.filepath)

  const compileOptions: CompileOptions = {
    ...Value.Default(BuildOptions, Value.Clone(options)) as Required<BuildOptions>,
    document,
  }

  await compile(compileOptions)
}
