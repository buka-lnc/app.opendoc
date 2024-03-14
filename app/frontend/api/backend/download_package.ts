import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  200: unknown
  400: {
  "statusCode": number
  "message": string
  "error"?: string
}
}


interface QueryArg {
}

interface ParamArg {
    packageName: string
    packageTag: string
}

interface HeaderArg {
}


/**
 * 下载包
 */
export function downloadPackage<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/registry/:scope/:packageName/-/:packageTag.tgz")
    .option('module', {
      name: "backend",
      pathname: "/api/registry/:scope/:packageName/-/:packageTag.tgz",
    })

  if (arg && "packageName" in arg) req.params("packageName", String(arg["packageName"]))
  if (arg && "packageTag" in arg) req.params("packageTag", String(arg["packageTag"]))

  return req
}
