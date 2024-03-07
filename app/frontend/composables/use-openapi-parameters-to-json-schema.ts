import { OpenAPIV3 } from 'openapi-types'

export function useOpenapiParametersToJsonSchema (parameters: MaybeRef<OpenAPIV3.ParameterObject[]>): Ref<OpenAPIV3.NonArraySchemaObject | undefined> {
  const schema = computed(() => {
    const items = toValue(parameters)

    if (!items.length) return

    const schema: OpenAPIV3.SchemaObject = {
      type: 'object',
      properties: {},
      required: [],
    }

    for (const parameter of items) {
      if (parameter.required) {
        schema.required!.push(parameter.name)
      }

      schema.properties![parameter.name] = parameter.schema ? { ...parameter.schema } : {}
    }

    return schema
  })

  return schema
}
