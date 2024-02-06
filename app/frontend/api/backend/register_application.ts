import { Keq } from 'keq'
import { request } from 'keq'
import { RegisterApplicationDTO } from "./components/schemas/register_application_dto"

interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function registerApplication(arg?: QueryArg & ParamArg & HeaderArg & (RegisterApplicationDTO)): Keq<any> {
  const req = request.put("/api/application")
    .option('module', {
      name: "backend",
      pathname: "/api/application",
    })

  if (arg && "title" in arg) req.send({ "title": arg["title"] })
  if (arg && "code" in arg) req.send({ "code": arg["code"] })

  return req
}
