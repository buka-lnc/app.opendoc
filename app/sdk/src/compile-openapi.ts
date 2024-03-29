import * as SwaggerParser from '@apidevtools/swagger-parser'
import * as chalk from 'chalk'
import * as changeCase from 'change-case'
import * as fs from 'fs-extra'
import { OpenAPIV3 } from 'openapi-types'
import * as path from 'path'
import * as R from 'ramda'
import { getSafeOperationName } from './utils/get-safe-operation-name'
import { CompileResult } from './interface/compile-result'
import { readAndCompileTemplate } from './utils/read-and-compile-template'

import './handlebar/register-helper.js'
import './handlebar/register-partial.js'
import { CompileOpenapiOptions } from './interface/compile-openapi-options'


const templates = {
  t_schema: readAndCompileTemplate('json-schema/file'),
  t_schema_exports: readAndCompileTemplate('json-schema/exports'),

  t_request: readAndCompileTemplate('openapi/request'),
  t_operation: readAndCompileTemplate('openapi/operation'),
  t_hook: readAndCompileTemplate('openapi/hook'),
  t_type: readAndCompileTemplate('openapi/type'),

  t_operation_exports: readAndCompileTemplate('openapi/exports'),
}


function compile(options: CompileOpenapiOptions): CompileResult[] {
  const document: OpenAPIV3.Document = options.document

  const moduleName = options.moduleName
  const fileNamingStyle = options.fileNamingStyle
  const formatFilename = changeCase[fileNamingStyle]
  const outdir = options?.outdir || `${process.cwd()}/api`
  const output = path.join(outdir)

  const results: CompileResult[] = []
  if (document.components?.schemas && !R.isEmpty(document.components.schemas)) {
    for (const [name, jsonSchema] of R.toPairs(document.components.schemas)) {
      const fileContent = templates.t_schema({
        name,
        jsonSchema,

        document,
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

            document,
            moduleName,
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
        path: path.join(output, 'operations', 'index.ts'),
        content: operationExportsFileContent,
      },
      {
        name: 'index.ts',
        path: path.join(output, 'hooks', 'index.ts'),
        content: operationExportsFileContent,
      },
    )

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

  return results
}

export async function compileOpenapi(options: CompileOpenapiOptions): Promise<void> {
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

