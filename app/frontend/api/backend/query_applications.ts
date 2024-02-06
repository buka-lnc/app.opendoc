import { Keq } from 'keq'
import { request } from 'keq'
import { QueryApplicationsResponseDTO } from "./components/schemas/query_applications_response_dto"

type Response_200_application_json = QueryApplicationsResponseDTO

interface QueryArg {
    title?: string
    limit: number
    offset: number
}

interface ParamArg {
}

interface HeaderArg {
}


export function queryApplications(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json> {
  const req = request.get<Response_200_application_json>("/api/application")
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
