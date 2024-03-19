import { Keq } from 'keq'
import { request } from 'keq'
import { PackageMetadataDTO } from "./components/schemas/package_metadata_dto"


interface ResponseMap {
  200: PackageMetadataDTO
}


interface QueryArg {
}

interface ParamArg {
    packageName: string
}

interface HeaderArg {
}


/**
 * 查询包的元数据
 */
export function getPackageMetadata<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/registry/:packageScope/:packageName")
    .option('module', {
      name: "backend",
      pathname: "/api/registry/:packageScope/:packageName",
    })

  if (arg && "packageName" in arg) req.params("packageName", String(arg["packageName"]))

  return req
}
