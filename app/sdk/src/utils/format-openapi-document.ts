import * as SwaggerParser from '@apidevtools/swagger-parser'
import * as chalk from 'chalk'
import { OpenAPI, OpenAPIV3 } from 'openapi-types'
import { fixSwagger } from 'swagger-fix'


export async function formatOpenapiDocument(document: OpenAPI.Document): Promise<OpenAPIV3.Document> {
  const swaggerParser = new SwaggerParser()
  await swaggerParser.bundle(document)

  if (!('openapi' in swaggerParser.api && swaggerParser.api.openapi.startsWith('3'))) {
    console.warn(chalk.yellow('Swagger file does not conform to the swagger@3.0 standard specifications or have grammatical errors, which may cause unexpected errors'))
  }

  return fixSwagger(document) as OpenAPIV3.Document
}
