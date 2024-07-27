import { createRequest } from "keq";
import { RequestException, throwException } from 'keq-exception'

export const request = createRequest()

request
  .use(throwException(async (ctx) => {
    if (ctx.response && ctx.response.status !== 200) {
      const body = await ctx.response.json()
      throw new RequestException(body.message)
    }
  }))
