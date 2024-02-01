import { Keq } from 'keq'
import { request } from 'keq'
import { Folder } from "./components/schemas/folder"

type Response_200_application_json = (Folder)[]

interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function queryFolders(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json> {
  const req = request.get<Response_200_application_json>("/api/folder")
    .option('module', {
      name: "backend",
      pathname: "/api/folder",
    })


  return req
}
