import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  "200": {
  "status"?: string
  "info"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  } | null
  "error"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  } | null
  "details"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  }
}
  "503": {
  "status"?: string
  "info"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  } | null
  "error"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  } | null
  "details"?: {
    [key: string]: undefined | {
      "status": string
      [key: string]: undefined | any
    }
  }
}
}


interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function checkHealth<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>("/api/health")
    .option('module', {
      name: "backend",
      pathname: "/api/health",
    })


  return req
}
