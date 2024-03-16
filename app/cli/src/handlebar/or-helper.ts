import * as Handlebars from 'handlebars'
import * as R from 'ramda'


Handlebars.registerHelper('or', (...args) => {
  const arr = R.dropLast(1, args)
  return R.any(R.identity, arr)
})
