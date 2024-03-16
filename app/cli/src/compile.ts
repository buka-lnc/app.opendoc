import * as chalk from 'chalk'
import * as changeCase from 'change-case'
import * as fs from 'fs-extra'
import { OpenAPIV3 } from 'openapi-types'
import * as path from 'path'
import * as R from 'ramda'
import { File } from './interface/file'
import { CompileOptions } from './interface/compile-options'
import { getSafeOperationName } from './utils/get-safe-operation-name'
import { readTemplate } from './utils/read-template'

import * as Handlebars from 'handlebars'
import './handlebar/register-helper.js'
import './handlebar/register-partial.js'

const readAndCompileTemplate = (filename: string): ReturnType<typeof Handlebars.compile> => Handlebars.compile(readTemplate(filename))
const templates = {
  t_schema: readAndCompileTemplate('schema'),
  t_schema_exports: readAndCompileTemplate('schema-exports'),
  t_operation: readAndCompileTemplate('operation'),
  t_operation_exports: readAndCompileTemplate('operation-exports'),
}


function compileDocument(options: CompileOptions): File[] {
  const api: OpenAPIV3.Document = options.document

  const moduleName = options.moduleName
  const fileNamingStyle = options.fileNamingStyle
  const formatFilename = changeCase[fileNamingStyle]
  const outdir = options?.outdir || `${process.cwd()}/api`
  const output = path.join(outdir, formatFilename(moduleName))
  const requestInstance = 'keq'

  const files: File[] = []
  if (api.components?.schemas && !R.isEmpty(api.components.schemas)) {
    for (const [name, schema] of R.toPairs(api.components.schemas)) {
      const fileContent = templates.t_schema({
        api,
        name,
        schema,
        options: {
          fileNamingStyle,
        },
      })
      const filename = formatFilename(name)
      const filepath = path.join(output, 'components', 'schemas', `${filename}.ts`)

      files.push({
        name: filename,
        path: filepath,
        content: fileContent,
      })
    }

    const schemaExportsFilepath = path.join(output, 'components', 'schemas', 'index.ts')
    const schemaExportsFileContent = templates.t_schema_exports({
      api,
      options: {
        fileNamingStyle,
      },
    })

    files.push({
      name: 'index.ts',
      path: schemaExportsFilepath,
      content: schemaExportsFileContent,
    })
  }

  if (api.paths && !R.isEmpty(api.paths)) {
    for (const [pathname, pathItem] of Object.entries(api.paths)) {
      if (!pathItem) continue

      for (const [method, operation] of Object.entries(pathItem)) {
        if (typeof operation === 'object' && !Array.isArray(operation)) {
          const fileContent = templates.t_operation({
            api,
            moduleName,
            pathname,
            method,
            operation,
            options: {
              fileNamingStyle,
              request: requestInstance,
            },
          })

          const filename = formatFilename(getSafeOperationName(pathname, method, operation))
          const filepath = path.join(output, `${filename}.ts`)

          files.push({
            name: filename,
            path: filepath,
            content: fileContent,
          })
        } else {
          console.warn(chalk.yellow(`Operation ${String(method)} on path ${String(pathname)} cannot compiled, skipping`))
        }
      }
    }

    const operationExportsFilepath = path.join(output, 'index.ts')
    const operationExportsFileContent = templates.t_operation_exports({
      api,
      options: {
        fileNamingStyle,
      },
    })

    files.push({
      name: 'index.ts',
      path: operationExportsFilepath,
      content: operationExportsFileContent,
    })
  }

  return files
}

export async function compile(options: CompileOptions): Promise<void> {
  const files = compileDocument(options)

  await Promise.all(files.map(async (file) => {
    await fs.ensureFile(file.path)
    await fs.writeFile(file.path, file.content)
  }))
}
