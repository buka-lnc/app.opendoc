import { Keq } from 'keq'
import { request } from 'keq'
import { Application } from "./components/schemas/application"

type Response_200_application_json = Application

interface QueryArg {
}

interface ParamArg {
    applicationId: string
}

interface HeaderArg {
}


export function queryApplication(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json> {
  const req = request.get<Response_200_application_json>("/api/application/:applicationIdOrCode")
    .option('module', {
      name: "backend",
      pathname: "/api/application/:applicationIdOrCode",
    })

  if (arg && "applicationId" in arg) req.params("applicationId", String(arg["applicationId"]))

  return req
}
