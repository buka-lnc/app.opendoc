import { RegisterOpendocOptions } from './interface/register-options'
import { registerApplication } from './request/register-application'
import { parseFile } from './parse-file';
import { parseFilepath } from './parse-filepath';
import { registerSheet } from './request/register-sheet'
import { parseGlob } from './parse-glob';


export async function register(options: RegisterOpendocOptions) {
  const { server, application, sheets } = options

  await registerApplication(server, application)

  const promises = sheets.map(async (sheet) => {
    if (sheet.type === 'openapi') {
      const buf = 'file' in sheet ? await parseFile('openapi.json', sheet.file) : await parseFilepath(sheet.filepath)
      await registerSheet(server, application, sheet, buf)
    } else if (sheet.type === 'asyncapi') {
      const buf = 'file' in sheet ? await parseFile('asyncapi.json', sheet.file) : await parseFilepath(sheet.filepath)
      await registerSheet(server, application, sheet, buf)
    } else if (sheet.type === 'markdown') {
      const buf = await parseGlob(sheet.glob)
      await registerSheet(server, application, sheet, buf)
    }

    throw new TypeError(`sheet type(${sheet.type}) is not supported`)
  })

  await Promise.allSettled(promises)
}
