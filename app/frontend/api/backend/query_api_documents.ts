import { Keq } from 'keq'
import { request } from 'keq'
import { ApiDocument } from "./components/schemas/api_document"

type Response_200_application_json = (ApiDocument)[]

interface QueryArg {
    folderId: string
}

interface ParamArg {
}

interface HeaderArg {
}


export function queryApiDocuments(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json> {
  const req = request.get<Response_200_application_json>("/api/document")
    .option('module', {
      name: "backend",
      pathname: "/api/document",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "folderId" in arg) req.query("folderId", queryWrap(arg["folderId"]))

  return req
}
