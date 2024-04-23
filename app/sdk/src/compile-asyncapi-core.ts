// import * as chalk from 'chalk'
import * as changeCase from 'change-case'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as R from 'ramda'
import { CompileResult } from './interface/compile-result.js'
import { readAndCompileTemplate } from './utils/read-and-compile-template.js'
import { CompileAsyncapiOptions } from './interface/compile-asyncapi-options'

import './handlebar/register-helper.js'
import './handlebar/register-partial.js'


const templates = {
  t_schema: readAndCompileTemplate('json-schema/file'),
  t_schema_exports: readAndCompileTemplate('json-schema/exports'),

  t_package_json: readAndCompileTemplate('asyncapi-core/package_json'),
}


function compile(options: CompileAsyncapiOptions): CompileResult[] {
  const document = options.document

  // const moduleName = options.moduleName
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

export async function compileAsyncapiCore(options: CompileAsyncapiOptions): Promise<void> {
  const files = compile(options)

  await Promise.allSettled(files.map(async (result) => {
    await fs.ensureFile(result.path)
    await fs.writeFile(result.path, result.content)
  }))
}

