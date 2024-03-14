import { Keq } from 'keq'
import { request } from 'keq'
import { QueryApplicationsResponseDTO } from "./components/schemas/query_applications_response_dto"


interface ResponseMap {
  200: QueryApplicationsResponseDTO
  500: unknown
}


interface QueryArg {
    title?: string
    limit: number
    offset: number
}

interface ParamArg {
}

interface HeaderArg {
}


export function queryApplications<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/application")
    .option('module', {
      name: "backend",
      pathname: "/api/application",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "title" in arg) req.query("title", queryWrap(arg["title"]))
  if (arg && "limit" in arg) req.query("limit", queryWrap(arg["limit"]))
  if (arg && "offset" in arg) req.query("offset", queryWrap(arg["offset"]))

  return req
}
