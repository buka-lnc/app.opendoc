import * as Handlebars from 'handlebars'

Handlebars.registerHelper('regexp', (str, options: Handlebars.HelperOptions) => new RegExp(str, options.hash.flags))
