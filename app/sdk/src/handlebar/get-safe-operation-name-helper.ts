/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Handlebars from 'handlebars'
import { getSafeOperationName } from '../utils/get-safe-operation-name'


Handlebars.registerHelper('h__get-safe-operation-name', getSafeOperationName)
