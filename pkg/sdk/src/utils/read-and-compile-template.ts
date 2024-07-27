
import * as Handlebars from 'handlebars'
import { readTemplate } from './read-template'


export function readAndCompileTemplate(filename: string): ReturnType<typeof Handlebars.compile> {
  return Handlebars.compile(readTemplate(filename))
}
