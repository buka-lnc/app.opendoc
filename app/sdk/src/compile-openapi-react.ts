import * as SwaggerParser from '@apidevtools/swagger-parser'
import * as chalk from 'chalk'
import * as changeCase from 'change-case'
import * as fs from 'fs-extra'
import { OpenAPIV3 } from 'openapi-types'
import * as path from 'path'
import * as R from 'ramda'
import { getSafeOperationName } from './utils/get-safe-operation-name.js'
import { CompileResult } from './interface/compile-result.js'
import { readAndCompileTemplate } from './utils/read-and-compile-template.js'

import './handlebar/register-helper.js'
import './handlebar/register-partial.js'
import { CompileOpenapiOptions } from './interface/compile-openapi-options.js'


const templates = {
  t_hook: readAndCompileTemplate('openapi-react/hook'),
  t_operation_exports: readAndCompileTemplate('openapi-react/hook-exports'),

  t_package_json: readAndCompileTemplate('openapi-react/package_json'),
}


function compile(options: CompileOpenapiOptions): CompileResult[] {
  const document: OpenAPIV3.Document = options.document

  const moduleName = options.moduleName
  const fileNamingStyle = options.fileNamingStyle
  const formatFilename = changeCase[fileNamingStyle]
  const outdir = options?.outdir || `${process.cwd()}/api`
  const output = path.join(outdir)

  let packageContext: Record<string, any> | undefined = undefined
  if (options.project) {
    if (!options.project.dependencies?.core) {
      throw new Error('Missing options.project.dependencies.core')
    }

    packageContext = {
      name: options.project.name,
      outdir: options.outdir,
      version: options.project.version,
      dependencies: options.project.dependencies,
    }
  }

  const results: CompileResult[] = []

  if (document.paths && !R.isEmpty(document.paths)) {
    for (const [pathname, pathItem] of Object.entries(document.paths)) {
      if (!pathItem) continue

      for (const [method, operation] of Object.entries(pathItem)) {
        if (typeof operation === 'object' && !Array.isArray(operation)) {
          const context = {
            pathname,
            method,
            operation,

            document,
            moduleName,
            fileNamingStyle,
            package: packageContext,
          }

          {
            const fileContent = templates.t_hook({ ...context })
            const filename = formatFilename(getSafeOperationName(pathname, method, operation))
            const filepath = path.join(output, 'hooks', `${filename}.ts`)

            results.push({
              name: filename,
              path: filepath,
              content: fileContent,
            })
          }
        } else {
          console.warn(chalk.yellow(`Operation ${String(method)} on path ${String(pathname)} cannot compiled, skipping`))
        }
      }
    }

    const operationExportsFileContent = templates.t_operation_exports({
      document,
      fileNamingStyle,
    })

    results.push(
      {
        name: 'index.ts',
        path: path.join(output, 'hooks', 'index.ts'),
        content: operationExportsFileContent,
      },
    )
  }

  if (packageContext) {
    const packageJsonFileContent = templates.t_package_json({
      package: packageContext,
    })
    results.push({
      name: 'package.json',
      path: path.join(outdir, 'package.json'),
      content: packageJsonFileContent,
    })
  }

  return results
}

export async function compileOpenapiReact(options: CompileOpenapiOptions): Promise<void> {
  const swaggerParser = new SwaggerParser()
  await swaggerParser.bundle(options.document)
  if (!('openapi' in swaggerParser.api && swaggerParser.api.openapi.startsWith('3'))) {
    console.warn(chalk.yellow('Swagger file does not conform to the swagger@3.0 standard specifications or have grammatical errors, which may cause unexpected errors'))
  }

  const files = compile(options)

  await Promise.allSettled(files.map(async (result) => {
    await fs.ensureFile(result.path)
    await fs.writeFile(result.path, result.content)
  }))
}

