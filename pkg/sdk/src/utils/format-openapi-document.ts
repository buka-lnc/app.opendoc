import * as SwaggerParser from '@apidevtools/swagger-parser'
import * as chalk from 'chalk'
import swaggerConverter from 'swagger2openapi'
import { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types'
import { fixSwagger } from 'swagger-fix'


async function toSwagger3(swagger: OpenAPI.Document): Promise<OpenAPIV3.Document> {
  if (typeof swagger === 'object' && swagger['swagger'] === '2.0') {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        swaggerConverter.convertObj(
          swagger as OpenAPIV2.Document,
          { patch: true, warnOnly: true },
          (err, options) => {
            if (err) reject(err)
            else resolve(options.openapi)
          }
        )
      })

      return result as OpenAPIV3.Document
    } catch (err) {
      console.error(err)
      throw new Error('The swagger file cannot be converted to OpenAPI 3.0')
    }
  }

  return swagger as OpenAPIV3.Document
}

export async function formatOpenapiDocument(document: OpenAPI.Document): Promise<OpenAPIV3.Document> {
  const swaggerParser = new SwaggerParser()
  await swaggerParser.bundle(document)

  if (!('openapi' in swaggerParser.api && swaggerParser.api.openapi.startsWith('3'))) {
    console.warn(chalk.yellow('Swagger file does not conform to the swagger@3.0 standard specifications or have grammatical errors, which may cause unexpected errors'))
  }

  const swagger = fixSwagger(document)
  return toSwagger3(swagger)
}
