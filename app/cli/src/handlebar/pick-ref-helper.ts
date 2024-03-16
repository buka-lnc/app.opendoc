/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Handlebars from 'handlebars'
import { OpenAPIV3 } from 'openapi-types'
import * as R from 'ramda'
import { dropLastArguments } from './drop-last-arguments.js'


function pickRef(schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): string[] {
  const refs: string[] = []
  if (!schema) return refs

  if ('oneOf' in schema && schema.oneOf) {
    refs.push(...R.unnest(R.map(pickRef, schema.oneOf)))
  }
  if ('anyOf' in schema && schema.anyOf) {
    refs.push(...R.unnest(R.map(pickRef, schema.anyOf)))
  }
  if ('allOf' in schema && schema.allOf) {
    refs.push(...R.unnest(R.map(pickRef, schema.allOf)))
  }
  if ('$ref' in schema) {
    refs.push(schema.$ref)
  }
  if ('properties' in schema && schema.properties) {
    refs.push(...R.unnest(Object.values(schema.properties).map(pickRef)))
  }
  if ('additionalProperties' in schema && typeof schema.additionalProperties === 'object') {
    refs.push(...pickRef(schema.additionalProperties))
  }
  if ('type' in schema && schema.type === 'array') {
    if (Array.isArray(schema.items)) {
      refs.push(...R.unnest(schema.items.map(pickRef)))
    } else if (schema.items) {
      refs.push(...pickRef(schema.items))
    }
  }

  return R.uniq(refs)
}

Handlebars.registerHelper('pick-ref', dropLastArguments(R.curry(pickRef)))
