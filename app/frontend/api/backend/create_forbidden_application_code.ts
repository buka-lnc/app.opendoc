import { Keq } from 'keq'
import { request } from 'keq'
import { CreateForbiddenApplicationCodeDTO } from "./components/schemas/create_forbidden_application_code_dto"


interface ResponseMap {
  "201": unknown
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function createForbiddenApplicationCode<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg & (CreateForbiddenApplicationCodeDTO)): Keq<ResponseMap[STATUS]> {
  const req = request.post<ResponseMap[STATUS]>("/api/forbidden-application-code")
    .option('module', {
      name: "backend",
      pathname: "/api/forbidden-application-code",
    })

  if (arg && "code" in arg) req.send({ "code": arg["code"] })

  return req
}
