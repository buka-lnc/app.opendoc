import * as chalk from 'chalk'
import * as SwaggerParser from '@apidevtools/swagger-parser'
import { compile } from './compile'
import { Exception } from './exception'
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

  const swaggerParser = new SwaggerParser()
  const promises = Object.keys(options.modules).map(async (moduleName) => {
    try {
      const document = await readOpenapiFile(options.modules[moduleName])
      await swaggerParser.bundle(document)

      if (!('openapi' in swaggerParser.api && swaggerParser.api.openapi.startsWith('3'))) {
        console.warn(chalk.yellow('Swagger file does not conform to the swagger@3.0 standard specifications or have grammatical errors, which may cause unexpected errors'))
      }

      const compileOptions: CompileOptions = {
        ...Value.Default(BuildOptions, Value.Clone(options)) as Required<BuildOptions>,
        moduleName,
        document,
      }

      await compile(compileOptions)
      return moduleName
    } catch (e) {
      if (e instanceof Exception) {
        throw e
      } else if (e instanceof Error) {
        console.log(e)
        throw new Exception(moduleName, e.message)
      } else if (typeof e === 'string') {
        throw new Exception(moduleName, e)
      } else {
        throw e
      }
    }
  })

  const results = await Promise.allSettled(promises)

  for (const result of results) {
    if (result.status === 'rejected') {
      console.log(chalk.red(String(result.reason.message)))
    } else {
      console.log(chalk.green(`${result.value} module compiled successfully.`))
    }
  }
}
