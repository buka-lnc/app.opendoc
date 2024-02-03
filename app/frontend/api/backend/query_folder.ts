import { Keq } from 'keq'
import { request } from 'keq'
import { Folder } from "./components/schemas/folder"

type Response_200_application_json = Folder

interface QueryArg {
}

interface ParamArg {
    folderIdOrMpath: string
}

interface HeaderArg {
}


export function queryFolder(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json> {
  const req = request.get<Response_200_application_json>("/api/folder/:folderIdOrMpath")
    .option('module', {
      name: "backend",
      pathname: "/api/folder/:folderIdOrMpath",
    })

  if (arg && "folderIdOrMpath" in arg) req.params("folderIdOrMpath", String(arg["folderIdOrMpath"]))

  return req
}
