import { Keq } from 'keq'
import { request } from 'keq'
import { RegisterApplicationDTO } from "./components/schemas/register_application_dto"


interface ResponseMap {
  200: unknown
  500: unknown
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function registerApplication<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg & (RegisterApplicationDTO)): Keq<ResponseMap[STATUS]> {
  const req = request.put<ResponseMap[STATUS]>
  ("/api/application")
    .option('module', {
      name: "backend",
      pathname: "/api/application",
    })

  if (arg && "title" in arg) req.send({ "title": arg["title"] })
  if (arg && "code" in arg) req.send({ "code": arg["code"] })

  return req
}
