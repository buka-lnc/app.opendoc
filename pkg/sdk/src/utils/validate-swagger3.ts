import { OpenAPIV3 } from 'openapi-types'
import * as chalk from 'chalk'
import * as SwaggerParser from '@apidevtools/swagger-parser'
import * as semver from 'semver'


export async function validateSwagger3(swagger: OpenAPIV3.Document): Promise<OpenAPIV3.Document> {
  const swaggerParser = new SwaggerParser()

  try {
    await swaggerParser.bundle(swagger)

    if (!('openapi' in swaggerParser.api && semver.satisfies(swaggerParser.api.openapi, '^3'))) throw new Error('Only supports OpenAPI3')
    return swaggerParser.api as OpenAPIV3.Document
  } catch (e) {
    console.warn(chalk.yellow('Swagger file does not conform to the swagger@3.0 standard specifications or have grammatical errors, which may cause unexpected errors'))
    return swagger
  }
}

