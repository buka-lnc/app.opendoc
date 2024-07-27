/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Handlebars from 'handlebars'
import { readTemplate } from '../utils/read-template'


Handlebars.registerPartial('t_comments', readTemplate('comments'))

Handlebars.registerPartial('t_json_schema_shape', readTemplate('json-schema/shape'))
Handlebars.registerPartial('t_json_schema_shape__enum', readTemplate('json-schema/shape/enum'))
Handlebars.registerPartial('t_json_schema_shape__object', readTemplate('json-schema/shape/object'))
Handlebars.registerPartial('t_json_schema_shape__array', readTemplate('json-schema/shape/array'))
Handlebars.registerPartial('t_json_schema_shape__one_of', readTemplate('json-schema/shape/one-of'))
Handlebars.registerPartial('t_json_schema_shape__any_of', readTemplate('json-schema/shape/any-of'))
Handlebars.registerPartial('t_json_schema_shape__all_of', readTemplate('json-schema/shape/all-of'))
Handlebars.registerPartial('t_json_schema_interface', readTemplate('json-schema/interface'))
