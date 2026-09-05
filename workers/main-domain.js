import { onRequest } from '../functions/api/[[path]].js'

const ASSET_ORIGIN = 'https://resume.elpsy.cn'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    // Handle API requests before the asset proxy changes the request origin.
    if (url.pathname === '/api' || url.pathname.startsWith('/api/'))
      return onRequest({ request, env })

    const upstreamUrl = new URL(url.pathname + url.search, ASSET_ORIGIN)
    const headers = new Headers(request.headers)
    headers.delete('host')
    headers.delete('cookie')
    headers.delete('authorization')
    const upstream = await fetch(new Request(upstreamUrl, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    }))
    const response = new Response(upstream.body, upstream)
    const location = upstream.headers.get('location')
    if (location) {
      const target = new URL(location, ASSET_ORIGIN)
      if (target.origin === ASSET_ORIGIN) {
        target.protocol = url.protocol
        target.host = url.host
        response.headers.set('location', target.href)
      }
    }
    return response
  },
}
