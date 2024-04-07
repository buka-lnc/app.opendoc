import { Keq } from 'keq'
import { request } from 'keq'
import { Sdk } from "./components/schemas/sdk"


interface ResponseMap {
  "200": (Sdk)[]
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
    "version": string
    "apiDocumentId": string
}

interface HeaderArg {
}


export function querySdksByVersion<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/api-document/:apiDocumentId/version/:version/sdk")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document/:apiDocumentId/version/:version/sdk",
    })

  if (arg && "version" in arg) req.params("version", String(arg["version"]))
  if (arg && "apiDocumentId" in arg) req.params("apiDocumentId", String(arg["apiDocumentId"]))

  return req
}
