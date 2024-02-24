import { Keq } from 'keq'
import { request } from 'keq'
import { QueryApiDocumentsResponseDTO } from "./components/schemas/query_api_documents_response_dto"

type Response_200_application_json = QueryApiDocumentsResponseDTO

interface QueryArg {
    title?: string
    type?: string
    limit?: number
    offset?: number
}

interface ParamArg {
}

interface HeaderArg {
}


export function queryApiDocuments(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json> {
  const req = request.get<Response_200_application_json>("/api/api-document")
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
