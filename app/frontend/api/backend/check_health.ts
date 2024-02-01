import { Keq } from 'keq'
import { request } from 'keq'

interface Response_200_application_json {
  status?: string
  info?: {
    [key: string]: undefined | {
      status?: string
      [key: string]: undefined | string
    }
  } | null
  error?: {
    [key: string]: undefined | {
      status?: string
      [key: string]: undefined | string
    }
  } | null
  details?: {
    [key: string]: undefined | {
      status?: string
      [key: string]: undefined | string
    }
  }
}

interface Response_503_application_json {
  status?: string
  info?: {
    [key: string]: undefined | {
      status?: string
      [key: string]: undefined | string
    }
  } | null
  error?: {
    [key: string]: undefined | {
      status?: string
      [key: string]: undefined | string
    }
  } | null
  details?: {
    [key: string]: undefined | {
      status?: string
      [key: string]: undefined | string
    }
  }
}

interface QueryArg {
}

interface ParamArg {
}

interface HeaderArg {
}


export function checkHealth(arg?: QueryArg & ParamArg & HeaderArg): Keq<Response_200_application_json | Response_503_application_json> {
  const req = request.get<Response_200_application_json | Response_503_application_json>("/api/health")
    .option('module', {
      name: "backend",
      pathname: "/api/health",
    })


  return req
}
