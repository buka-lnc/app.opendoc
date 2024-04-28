import { Keq } from 'keq'
import { request } from 'keq'
import { ForbiddenApplicationCode } from "./components/schemas/forbidden_application_code"


interface ResponseMap {
  "200": (ForbiddenApplicationCode)[]
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function queryForbiddenApplicationCodes<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/forbidden-application-code")
    .option('module', {
      name: "backend",
      pathname: "/api/forbidden-application-code",
    })


  return req
}
