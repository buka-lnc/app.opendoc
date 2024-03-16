import * as Handlebars from 'handlebars'

Handlebars.registerHelper('stringify', value => JSON.stringify(value, null, 2))
