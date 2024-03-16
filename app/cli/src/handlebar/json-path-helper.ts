/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Handlebars from 'handlebars'
import { JSONPath } from 'jsonpath-plus'
import { dropLastArguments } from './drop-last-arguments.js'


Handlebars.registerHelper('json-path', dropLastArguments((path, json) => JSONPath({ path, json })))
