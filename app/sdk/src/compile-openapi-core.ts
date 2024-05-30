import * as chalk from 'chalk'
import * as changeCase from 'change-case'
import * as fs from 'fs-extra'
import { OpenAPIV3 } from 'openapi-types'
import * as path from 'path'
import * as R from 'ramda'
import { getSafeOperationName } from './utils/get-safe-operation-name'
import { CompileResult } from './types/compile-result'
import { readAndCompileTemplate } from './utils/read-and-compile-template'

import './handlebar/register-helper.js'
import './handlebar/register-partial.js'
import { CompileOpenapiOptions } from './types/compile-openapi-options'
import { formatOpenapiDocument } from './utils/format-openapi-document'


const templates = {
  t_schema: readAndCompileTemplate('json-schema/file'),
  t_schema_exports: readAndCompileTemplate('json-schema/exports'),

  t_request: readAndCompileTemplate('openapi-core/request'),
  t_operation: readAndCompileTemplate('openapi-core/operation'),
  t_type: readAndCompileTemplate('openapi-core/type'),

  t_operation_exports: readAndCompileTemplate('openapi-core/operation-exports'),

  t_package_json: readAndCompileTemplate('openapi-core/package_json'),
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
    packageContext = {
      name: options.project.name,
      outdir: options.outdir,
      version: options.project.version,
      dependencies: options.project.dependencies,
      registry: options.project.registry,
    }
  }


  const results: CompileResult[] = []
  if (document.components?.schemas && !R.isEmpty(document.components.schemas)) {
    for (const [name, jsonSchema] of R.toPairs(document.components.schemas)) {
      const fileContent = templates.t_schema({
        name,
        jsonSchema,

        document,
        package: packageContext,
        fileNamingStyle,
      })

      const filename = formatFilename(name)
      const filepath = path.join(output, 'schemas', `${filename}.ts`)

      results.push({
        name: filename,
        path: filepath,
        content: fileContent,
      })
    }

    const schemaExportsFilepath = path.join(output, 'schemas', 'index.ts')
    const schemaExportsFileContent = templates.t_schema_exports({
      jsonSchemas: document.components.schemas,

      package: packageContext,
      fileNamingStyle,
    })

    results.push({
      name: 'index.ts',
      path: schemaExportsFilepath,
      content: schemaExportsFileContent,
    })
  }

  if (document.paths && !R.isEmpty(document.paths)) {
    for (const [pathname, pathItem] of Object.entries(document.paths)) {
      if (!pathItem) continue

      for (const [method, operation] of Object.entries(pathItem)) {
        if (typeof operation === 'object' && !Array.isArray(operation)) {
          const context = {
            pathname,
            method,
            operation,

            moduleName,
            document,
            package: packageContext,
            fileNamingStyle,
          }

          {
            const fileContent = templates.t_type({ ...context })
            const filename = formatFilename(getSafeOperationName(pathname, method, operation))
            const filepath = path.join(output, 'types', `${filename}.ts`)

            results.push({
              name: filename,
              path: filepath,
              content: fileContent,
            })
          }

          {
            const fileContent = templates.t_operation({ ...context })
            const filename = formatFilename(getSafeOperationName(pathname, method, operation))
            const filepath = path.join(output, 'operations', `${filename}.ts`)

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

    results.push({
      name: 'index.ts',
      path: path.join(output, 'operations', 'index.ts'),
      content: operationExportsFileContent,
    })

    const requestFileContent = templates.t_request({
      document,
      fileNamingStyle,
    })

    results.push({
      name: 'request.ts',
      path: path.join(output, 'request.ts'),
      content: requestFileContent,
    })
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

export async function compileOpenapiCore(options: CompileOpenapiOptions): Promise<void> {
  const document = formatOpenapiDocument(options.document)
  const files = compile({ ...options, document })

  await Promise.allSettled(files.map(async (result) => {
    await fs.ensureFile(result.path)
    await fs.writeFile(result.path, result.content)
  }))
}

