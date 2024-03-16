/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Handlebars from 'handlebars'
import { readTemplate } from '../utils/read-template'


Handlebars.registerPartial('t_shape', readTemplate('shape'))
Handlebars.registerPartial('t_shape__enum', readTemplate('shape/enum'))
Handlebars.registerPartial('t_shape__object', readTemplate('shape/object'))
Handlebars.registerPartial('t_shape__array', readTemplate('shape/array'))
Handlebars.registerPartial('t_shape__one_of', readTemplate('shape/one-of'))
Handlebars.registerPartial('t_shape__any_of', readTemplate('shape/any-of'))
Handlebars.registerPartial('t_shape__all_of', readTemplate('shape/all-of'))
Handlebars.registerPartial('t_comments', readTemplate('comments'))
Handlebars.registerPartial('t_interface', readTemplate('interface'))
