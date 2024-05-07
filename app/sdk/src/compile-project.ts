import * as fs from 'fs-extra'
import * as path from 'path'
import * as R from 'ramda'
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
  t__npmrc: readAndCompileTemplate('project/_npmrc'),
}

export async function compileProject(options: CompileProjectOptions): Promise<void> {
  if (!Value.Check(CompileProjectOptions, options)) {
    const errors = [...Value.Errors(CompileProjectOptions, options)]
    const message = errors.map((error) => `${error.path}: ${error.message}`).join('\n')
    throw TypeError(message)
  }

  const opts = Value.Default(CompileProjectOptions, Value.Clone(options)) as Required<CompileProjectOptions>

  const { outdir, name, version, dependencies, registry } = opts
  const context = {
    package: {
      name,
      outdir,
      version,
      registry,
      dependencies,
    },
  }


  const tsconfigFilepath = path.join(outdir, 'tsconfig.json')
  const tsconfigFileContent = templates.t_tsconfig_json(R.clone(context))

  const tsconfigEsFilepath = path.join(outdir, 'tsconfig.es.json')
  const tsconfigEsFileContent = templates.t_tsconfig_es_json(R.clone(context))

  const tsconfigUmdFilepath = path.join(outdir, 'tsconfig.umd.json')
  const tsconfigUmdFileContent = templates.t_tsconfig_umd_json(R.clone(context))

  const buildShFilepath = path.join(outdir, 'build.sh')
  const buildShFileContent = templates.t_build_sh(R.clone(context))

  const gitignoreFilepath = path.join(outdir, '.gitignore')
  const gitignoreFileContent = templates.t__gitignore(R.clone(context))

  const npmignoreFilepath = path.join(outdir, '.npmignore')
  const npmignoreFileContent = templates.t__npmignore(R.clone(context))

  const npmrcFilepath = path.join(outdir, '.npmrc')
  const npmrcFileContent = templates.t__npmrc(R.clone(context))

  await Promise.allSettled([
    fs.outputFile(tsconfigFilepath, tsconfigFileContent),
    fs.outputFile(tsconfigEsFilepath, tsconfigEsFileContent),
    fs.outputFile(tsconfigUmdFilepath, tsconfigUmdFileContent),
    fs.outputFile(buildShFilepath, buildShFileContent),
    fs.outputFile(gitignoreFilepath, gitignoreFileContent),
    fs.outputFile(npmignoreFilepath, npmignoreFileContent),
    fs.outputFile(npmrcFilepath, npmrcFileContent),
  ])

  await fs.chmod(buildShFilepath, 0o755)
}
