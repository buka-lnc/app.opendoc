/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Handlebars from 'handlebars'
import * as R from 'ramda'
import { dropLastArguments } from './drop-last-arguments.js'


Handlebars.registerHelper('ref-name', dropLastArguments(R.curry((ref: string) => R.last(ref.split('/')))))
