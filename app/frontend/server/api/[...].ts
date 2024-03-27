
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  const origin = config.apiBaseOrigin || 'http://localhost:8080'

  if (event.node.req.url?.startsWith('/api')) {
    return proxyRequest(
      event,
      new URL(
        event.node.req.url,
        origin,
      ).toString(),
    )
  }
})
