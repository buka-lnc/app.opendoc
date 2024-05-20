import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  "201": unknown
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


/**
 * 每隔 10 分钟自动同步一次
 */
export function syncApiDocuments<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.post<ResponseMap[STATUS]>("/api/sheet/sync")
    .option('module', {
      name: "backend",
      pathname: "/api/sheet/sync",
    })


  return req
}
