import { Keq } from 'keq'
import { request } from 'keq'
import { Sdk } from "./components/schemas/sdk"


interface ResponseMap {
  "200": Sdk
}


interface QueryArg {
}

interface ParamArg {
    "sdkId": string
}

interface HeaderArg {
}


export function querySdkById<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/sdk/:sdkId")
    .option('module', {
      name: "backend",
      pathname: "/api/sdk/:sdkId",
    })

  if (arg && "sdkId" in arg) req.params("sdkId", String(arg["sdkId"]))

  return req
}
