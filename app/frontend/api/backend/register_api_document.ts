import { Keq } from 'keq'
import { request } from 'keq'
import { RegisterApiDocumentDTO } from "./components/schemas/register_api_document_dto"


interface ResponseMap {
  "200": unknown
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


/**
 * 若 applicationCode 指定的应用不存在，则会新建一个应用；否则，更新应用。
 */
export function registerApiDocument<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg & (RegisterApiDocumentDTO)): Keq<ResponseMap[STATUS]> {
  const req = request.put<ResponseMap[STATUS]>
  ("/api/api-document")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document",
    })


  return req
}
