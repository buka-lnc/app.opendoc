import { Keq } from 'keq'
import { request } from 'keq'

interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function syncDocuments(arg?: QueryArg & ParamArg & HeaderArg): Keq<any> {
  const req = request.post("/api/document/sync")
    .option('module', {
      name: "backend",
      pathname: "/api/document/sync",
    })


  return req
}
