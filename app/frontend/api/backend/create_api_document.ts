import { Keq } from 'keq'
import { request } from 'keq'
import { ApiDocument } from "./components/schemas/api_document"
import { CreateApiDocumentDTO } from "./components/schemas/create_api_document_dto"


interface ResponseMap {
  "201": ApiDocument
  "500": unknown
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function createApiDocument<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg & (CreateApiDocumentDTO)): Keq<ResponseMap[STATUS]> {
  const req = request.post<ResponseMap[STATUS]>
  ("/api/api-document")
    .option('module', {
      name: "backend",
      pathname: "/api/api-document",
    })

  if (arg && "applicationCode" in arg) req.send({ "applicationCode": arg["applicationCode"] })
  if (arg && "apiDocumentCode" in arg) req.send({ "apiDocumentCode": arg["apiDocumentCode"] })
  if (arg && "apiDocumentType" in arg) req.send({ "apiDocumentType": arg["apiDocumentType"] })
  if (arg && "apiDocumentTitle" in arg) req.send({ "apiDocumentTitle": arg["apiDocumentTitle"] })
  if (arg && "apiDocumentCronSyncUrl" in arg) req.send({ "apiDocumentCronSyncUrl": arg["apiDocumentCronSyncUrl"] })
  if (arg && "apiDocumentOrder" in arg) req.send({ "apiDocumentOrder": arg["apiDocumentOrder"] })
  if (arg && "apiDocumentFileTag" in arg) req.send({ "apiDocumentFileTag": arg["apiDocumentFileTag"] })
  if (arg && "apiDocumentMode" in arg) req.send({ "apiDocumentMode": arg["apiDocumentMode"] })

  return req
}
