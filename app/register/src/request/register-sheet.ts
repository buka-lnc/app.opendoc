import { RegisterSheetOptions } from "~/interface/register-sheet-options"
import { ServerOptions } from "../interface/server-options"
import { request } from "./request"
import { RegisterApplicationOptions } from "~/interface/register-application-options"

export async function registerSheet (server: ServerOptions, application: RegisterApplicationOptions, sheet: RegisterSheetOptions, raw: Buffer) {
  const origin = server.origin.replace(/\/$/, '')

  try {
    await request
      .put(`${origin}/api/sheet/register`)
      .field('applicationCode', application.code)
      .field('sheetType', sheet.type)
      .field('sheetCode', sheet.code)
      .field('sheetTitle', sheet.title || sheet.code)
      .field('sheetOrder', String(sheet.order || 1))
      .field('apiFileVersionTag', sheet.tag || 'latest')
      .attach('apiFileRaw', raw)
      .retry(3, 100)
  } catch (e) {
    let message = 'register api document failed'
    if (e instanceof Error) {
      message += `: ${e.message}`
    }
    throw new Error(message)
  }
}

