import { createRequest } from "keq";
import { RequestException } from 'keq-exception'

export const request = createRequest()

request
  .use(async (ctx, next) => {
    await next()
    if (ctx.response && ctx.response.status !== 200) {
      throw new RequestException(ctx.response.status)
    }
  })
