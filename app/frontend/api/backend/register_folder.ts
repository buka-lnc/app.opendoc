import { Keq } from 'keq'
import { request } from 'keq'
import { RegisterFolderDTO } from "./components/schemas/register_folder_dto"

interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function registerFolder(arg?: QueryArg & ParamArg & HeaderArg & (RegisterFolderDTO)): Keq<any> {
  const req = request.post("/api/folder")
    .option('module', {
      name: "backend",
      pathname: "/api/folder",
    })

  if (arg && "title" in arg) req.send({ "title": arg["title"] })
  if (arg && "mpath" in arg) req.send({ "mpath": arg["mpath"] })

  return req
}
