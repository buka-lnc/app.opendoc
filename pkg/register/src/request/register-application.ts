import { ServerOptions } from "~/interface/server-options";
import { request } from "./request";
import { RegisterApplicationOptions } from "~/interface/register-application-options";

export async function registerApplication(server: ServerOptions, application: RegisterApplicationOptions) {
  try {
    const origin = server.origin.replace(/\/$/, '')

    await request
      .put(`${origin}/api/application`)
      .send({
        code: application.code,
        title: application.title || application.code,
      })
      .retry(3, 100)
  } catch (e) {
    let message = 'Register application failed'
    if (e instanceof Error) {
      message += `: ${e.message}`
    }
    throw new Error(message)
  }
}
