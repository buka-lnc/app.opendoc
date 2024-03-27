import { Keq } from 'keq'
import { request } from 'keq'
import { Application } from "./components/schemas/application"
import { CreateApplicationDTO } from "./components/schemas/create_application_dto"


interface ResponseMap {
  "201": Application
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function createApplication<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg & (CreateApplicationDTO)): Keq<ResponseMap[STATUS]> {
  const req = request.post<ResponseMap[STATUS]>
  ("/api/application")
    .option('module', {
      name: "backend",
      pathname: "/api/application",
    })

  if (arg && "title" in arg) req.send({ "title": arg["title"] })
  if (arg && "code" in arg) req.send({ "code": arg["code"] })

  return req
}
