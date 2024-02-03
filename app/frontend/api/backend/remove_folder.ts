import { Keq } from 'keq'
import { request } from 'keq'

interface QueryArg {
}

interface ParamArg {
    folderIdOrMpath: string
}

interface HeaderArg {
}


export function removeFolder(arg?: QueryArg & ParamArg & HeaderArg): Keq<any> {
  const req = request.delete("/api/folder/:folderIdOrMpath")
    .option('module', {
      name: "backend",
      pathname: "/api/folder/:folderIdOrMpath",
    })

  if (arg && "folderIdOrMpath" in arg) req.params("folderIdOrMpath", String(arg["folderIdOrMpath"]))

  return req
}
