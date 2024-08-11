import { OpenAPI, OpenAPIV3 } from 'openapi-types'
import { fixSwagger } from 'swagger-fix'
import { toSwagger3 } from './to-swagger3'
import { removeUnnecessaryRef } from './remove-unnecessary-ref'
import { validateSwagger3 } from './validate-swagger3'


export async function formatOpenapiDocument(document: OpenAPI.Document): Promise<OpenAPIV3.Document> {
  // 修复中文和特殊字符串
  const swagger = fixSwagger(document)
  // 将 swagger2 转换为 swagger3
  const swagger3 = await toSwagger3(swagger)
  // 删除不必要的$ref，避免模板解析出错
  removeUnnecessaryRef(swagger3)

  // 验证swagger是否为合法的swagger3
  return validateSwagger3(swagger3)
}
