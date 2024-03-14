import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  200: unknown
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


/**
 * 查询包的元数据
 */
export function getPackageMetadata<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/registry/:packageName")
    .option('module', {
      name: "backend",
      pathname: "/api/registry/:packageName",
    })


  return req
}
