import { Keq } from 'keq'
import { request } from 'keq'
import { QueryApiDocumentsResponseDTO } from "./components/schemas/query_api_documents_response_dto"


interface ResponseMap {
  "200": QueryApiDocumentsResponseDTO
  "500": unknown
}


interface QueryArg {
    "title"?: string
    "type"?: string
    "limit"?: number
    "offset"?: number
}

interface ParamArg {
}

interface HeaderArg {
}


export function queryApiDocuments<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/api-document")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "title" in arg) req.query("title", queryWrap(arg["title"]))
  if (arg && "type" in arg) req.query("type", queryWrap(arg["type"]))
  if (arg && "limit" in arg) req.query("limit", queryWrap(arg["limit"]))
  if (arg && "offset" in arg) req.query("offset", queryWrap(arg["offset"]))

  return req
}
