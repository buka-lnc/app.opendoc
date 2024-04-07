import * as fs from 'fs-extra'
import * as path from 'path'
import { readAndCompileTemplate } from './utils/read-and-compile-template'

import './handlebar/register-helper.js'
import './handlebar/register-partial.js'
import { CompileProjectOptions } from './interface/compile-project-options'
import { Value } from '@sinclair/typebox/value'


const templates = {
  t_tsconfig_json: readAndCompileTemplate('project/tsconfig_json'),
  t_tsconfig_es_json: readAndCompileTemplate('project/tsconfig_es_json'),
  t_tsconfig_umd_json: readAndCompileTemplate('project/tsconfig_umd_json'),
  t_build_sh: readAndCompileTemplate('project/build_sh'),
  t__gitignore: readAndCompileTemplate('project/_gitignore'),
  t__npmignore: readAndCompileTemplate('project/_npmignore'),
}

export async function compileProject(options: CompileProjectOptions): Promise<void> {
  if (!Value.Check(CompileProjectOptions, options)) {
    const errors = [...Value.Errors(CompileProjectOptions, options)]
    const message = errors.map((error) => `${error.path}: ${error.message}`).join('\n')
    throw TypeError(message)
  }

  const { outdir, name, version } = Value.Default(CompileProjectOptions, Value.Clone(options)) as Required<CompileProjectOptions>
  const context = { name, version }


  const tsconfigFilepath = path.join(outdir, 'tsconfig.json')
  const tsconfigFileContent = templates.t_tsconfig_json(context)

  const tsconfigEsFilepath = path.join(outdir, 'tsconfig.es.json')
  const tsconfigEsFileContent = templates.t_tsconfig_es_json(context)

  const tsconfigUmdFilepath = path.join(outdir, 'tsconfig.umd.json')
  const tsconfigUmdFileContent = templates.t_tsconfig_umd_json(context)

  const buildShFilepath = path.join(outdir, 'build.sh')
  const buildShFileContent = templates.t_build_sh(context)

  const gitignoreFilepath = path.join(outdir, '.gitignore')
  const gitignoreFileContent = templates.t__gitignore(context)

  const npmignoreFilepath = path.join(outdir, '.npmignore')
  const npmignoreFileContent = templates.t__npmignore(context)

  await Promise.allSettled([
    fs.outputFile(tsconfigFilepath, tsconfigFileContent),
    fs.outputFile(tsconfigEsFilepath, tsconfigEsFileContent),
    fs.outputFile(tsconfigUmdFilepath, tsconfigUmdFileContent),
    fs.outputFile(buildShFilepath, buildShFileContent),
    fs.outputFile(gitignoreFilepath, gitignoreFileContent),
    fs.outputFile(npmignoreFilepath, npmignoreFileContent),
  ])

  await fs.chmod(buildShFilepath, 0o755)
}
