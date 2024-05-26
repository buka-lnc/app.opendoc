import { request } from 'keq'
import { throwException } from 'keq-exception'

request
  .useRouter()
  .module('backend', throwException(async (ctx) => {
    try {
      const body = await ctx.response?.json()
      if (body.message) return body.message
      return JSON.stringify(body)
    } catch (e) {
      return await ctx.response?.text()
    }
  }))
