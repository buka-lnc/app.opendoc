import { request } from 'keq'
import { RequestException, throwException } from 'keq-exception'

request
  .useRouter()
  .module('backend', throwException(async (ctx) => {
    if (ctx.response && !ctx.response.ok) {
      let body

      try {
        body = await ctx.response.json()
      } catch (e) {
        const message = await ctx.response?.text()
        throw new RequestException(ctx.response.status, message)
      }

      const message = body.message ? body.message : JSON.stringify(body)
      throw new RequestException(ctx.response.status, message)
    }
  }))
